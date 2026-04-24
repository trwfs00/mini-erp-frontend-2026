import { PageLayout } from "@/components/Layoutsaaaaa/Pageaaaaaaa";
import { StockTransactionTable } from "@/components/Tables/StockTransactionTable";
import { useLoadStockTransactions } from "@/pages/stock/hooks/useLoadStockTransactions";
import {
  Stack,
  Text,
  Title,
  Group,
  TextInput,
  Select,
  Button,
} from "@mantine/core";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { StockService } from "@/services/StockService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { StockTransactionFormDrawer } from "./components/StockTransactionFormDrawer";
import type { StockTransactionFormValues } from "@/schemas/stockSchema";
import type { TransactionType } from "@/types/stock/StockTransaction";
import type { CreateStockTransactionRequest } from "@/services/StockService/types/StockRequest";
import { useProductOptions } from "@/hooks/product/useProductOptions";
import { useStockSummary } from "@/hooks/stock/useStockSummary";
import { useEffect } from "react";
import { Alert, Badge } from "@mantine/core";
import { AlertCircle } from "lucide-react";

const StockPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [productFilter, setProductFilter] = useState<string | "">("");

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { options: productOptions } = useProductOptions();
  const { summary, fetchSummary } = useStockSummary();

  const {
    transactions,
    pagination,
    sortHandler,
    reloadTransactions,
    isLoading,
  } = useLoadStockTransactions({
    search: debouncedSearch,
    type: typeFilter,
    product_id: productFilter,
  });

  // Fetch summary when product filter changes
  useEffect(() => {
    if (productFilter) {
      fetchSummary(productFilter);
    }
  }, [productFilter, fetchSummary]);

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
      console.error("Failed to save transaction:", response.message);
    }

    setIsSaving(false);
  };

  return (
    <PageLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              Stock Transactions
            </Title>
            <Text c="gray.6" fz="sm">
              Manage inventory levels and track every movement.
            </Text>
          </Stack>

          <Group>
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => {
                setDrawerOpened(true);
              }}
            >
              New Transaction
            </Button>
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
            label="Search"
            placeholder="Search note or product..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={250}
          />
          <Select
            label="Type"
            placeholder="All Types"
            clearable
            data={[
              { value: "IN", label: "Stock IN" },
              { value: "OUT", label: "Stock OUT" },
              { value: "ADJUST", label: "Stock ADJUST" },
            ]}
            value={typeFilter}
            onChange={(val) => setTypeFilter((val as TransactionType) || "")}
            w={150}
          />
          <Select
            label="Product"
            placeholder="All Products"
            clearable
            searchable
            data={productOptions}
            value={productFilter}
            onChange={(val) => setProductFilter(val || "")}
            w={250}
          />
        </Group>

        {productFilter && summary && (
          <Alert
            variant="light"
            color={summary.is_low_stock ? "red" : "blue"}
            title={`Stock Summary: ${
              productOptions.find((o) => o.value === productFilter)?.label || ""
            }`}
            icon={<AlertCircle size={18} />}
          >
            <Group gap="xl">
              <Stack gap={0}>
                <Text fz="xs" c="dimmed" fw={500}>
                  CURRENT BALANCE
                </Text>
                <Text fz="xl" fw={700}>
                  {summary.current_stock}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed" fw={500}>
                  MINIMUM REQUIRED
                </Text>
                <Text fz="xl" fw={700}>
                  {summary.min_stock}
                </Text>
              </Stack>
              {summary.is_low_stock && (
                <Badge color="red" variant="filled" size="lg" mt="sm">
                  LOW STOCK WARNING
                </Badge>
              )}
            </Group>
          </Alert>
        )}

        <StockTransactionTable
          records={transactions}
          pagination={pagination}
          sortHandler={sortHandler}
          isLoading={isLoading}
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

export default StockPage;
