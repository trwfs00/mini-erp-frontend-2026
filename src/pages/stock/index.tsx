import { PageLayout } from "@/components/Layouts/Page";
import { StockTransactionTable } from "@/components/Tables/StockTransactionTable";
import { useLoadInitialData } from "@/pages/stock/hooks/useLoadInitialData";
import {
  Stack,
  Text,
  Title,
  Group,
  TextInput,
  Select,
  Button,
  Alert,
  Badge,
} from "@mantine/core";
import { Search, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";
import { StockService } from "@/services/StockService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { StockTransactionFormDrawer } from "./components/StockTransactionFormDrawer";
import type { StockTransactionFormValues } from "@/schemas/stockSchema";
import type { TransactionType } from "@/types/stock/StockTransaction";
import type { CreateStockTransactionRequest } from "@/services/StockService/types/StockRequest";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { useStockFilter } from "./hooks/useStockFilter";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { ROUTE_PATHS } from "@/router/routePaths";
import { usePermission } from "@/hooks/auth/usePermission";
import { tMenu } from "@/consts/translations/tMenu";
import { tBasic } from "@/consts/translations/tBasic";
import { tStockList } from "@/consts/translations/tStockList";
import { useTranslation } from "@/hooks/translation/useTranslation";

export const StockPage = () => {
  const t = useTranslation();
  const { canCreate } = usePermission("stock");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const pagination = usePaginationState();
  const sortHandler = useTableSort("created_at", "desc");
  const { form: filterForm, filterState } = useStockFilter();
  const productFilter = filterState.product_id ?? "";

  const {
    transactions,
    productOptions,
    summary,
    fetchSummary,
    isLoadingInitialData,
    isReloading,
    reloadTransactions,
  } = useLoadInitialData({
    search: debouncedSearch,
    typeFilter: filterState.type ?? "",
    productFilter,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sortHandler.sortBy,
    orderBy: sortHandler.orderBy,
    setTotalPage: pagination.setTotalPage,
    setTotalCount: pagination.setTotalCount,
    setPage: pagination.setPage,
  });

  const handleSave = async (values: StockTransactionFormValues) => {
    setIsSaving(true);

    let response;
    if (values.type === "IN") {
      response = await StockService.stockIn(
        values as CreateStockTransactionRequest,
      );
    } else if (values.type === "OUT") {
      response = await StockService.stockOut(
        values as CreateStockTransactionRequest,
      );
    } else {
      response = await StockService.stockAdjust(
        values as CreateStockTransactionRequest,
      );
    }

    if (response.ok) {
      await reloadTransactions();
      setDrawerOpened(false);
    } else {
      NotificationUtil.notifyError({
        title: t(tBasic.notifyCreateError(t(tStockList.transaction))),
        message: response.message,
      });
    }

    setIsSaving(false);
  };

  return (
    <PageLayout
      isLoading={isLoadingInitialData}
      breadcrumbs={{ label: tMenu.stock, path: ROUTE_PATHS.STOCK }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700}>
              {t(tStockList.title)}
            </Title>
            <Text c="dimmed" fz="sm">
              {t(tStockList.description)}
            </Text>
          </Stack>

          <Group>
            {canCreate && (
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => setDrawerOpened(true)}
              >
                {t(tStockList.form.addNew)}
              </Button>
            )}
            <RefreshButton
              onClick={async () => {
                await reloadTransactions();
                if (productFilter) fetchSummary(productFilter);
              }}
            />
          </Group>
        </Group>

        {/* Filters */}
        <Group align="flex-end">
          <TextInput
            label={t(tStockList.searchLabel)}
            placeholder={t(tStockList.searchPlaceholder)}
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={250}
          />
          <Select
            label={t(tStockList.typeLabel)}
            placeholder={t(tStockList.typeAllPlaceholder)}
            clearable
            data={[
              { value: "IN", label: t(tStockList.typeOptions.in) },
              { value: "OUT", label: t(tStockList.typeOptions.out) },
              { value: "ADJUST", label: t(tStockList.typeOptions.adjust) },
            ]}
            value={filterForm.values.type}
            onChange={(val) =>
              filterForm.setFieldValue("type", (val as TransactionType) ?? null)
            }
            w={150}
          />
          <Select
            label={t(tStockList.productLabel)}
            placeholder={t(tStockList.productAllPlaceholder)}
            clearable
            searchable
            data={productOptions}
            value={filterForm.values.product_id}
            onChange={(val) =>
              filterForm.setFieldValue("product_id", val ?? null)
            }
            w={250}
          />
        </Group>

        {productFilter && summary && (
          <Alert
            variant="light"
            color={summary.is_low_stock ? "red" : "blue"}
            title={`${t(tStockList.summary.title)}: ${
              productOptions
                .flatMap((o) =>
                  typeof o === "object" && "value" in o ? [o] : [],
                )
                .find((o) => o.value === productFilter)?.label ?? ""
            }`}
            icon={<AlertCircle size={18} />}
          >
            <Group gap="xl">
              <Stack gap={0}>
                <Text fz="xs" c="dimmed" fw={500}>
                  {t(tStockList.summary.currentBalance)}
                </Text>
                <Text fz="xl" fw={700}>
                  {summary.current_stock}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed" fw={500}>
                  {t(tStockList.summary.minimumRequired)}
                </Text>
                <Text fz="xl" fw={700}>
                  {summary.min_stock}
                </Text>
              </Stack>
              {summary.is_low_stock && (
                <Badge color="red" variant="filled" size="lg" mt="sm">
                  {t(tStockList.summary.lowStockWarning)}
                </Badge>
              )}
            </Group>
          </Alert>
        )}

        <StockTransactionTable
          records={transactions}
          pagination={pagination}
          sortHandler={sortHandler}
          isLoading={isReloading}
          isLoadingInitial={isLoadingInitialData}
        />

        <StockTransactionFormDrawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </Stack>
    </PageLayout>
  );
};
