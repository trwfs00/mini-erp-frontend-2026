import { PageLayout } from "@/components/Layouts/Page";
import { SupplierListTable } from "@/components/Tables/SupplierListTable";
import { useLoadInitialData } from "@/pages/supplier/hooks/useLoadInitialData";
import { Stack, Text, Title, Group, TextInput, Button } from "@mantine/core";
import { Search, Plus } from "lucide-react";
import type { SupplierList } from "@/types/supplier/SupplierList";
import { useState } from "react";
import { SupplierService } from "@/services/SupplierService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { SupplierFormDrawer } from "./components/SupplierFormDrawer";
import { modals } from "@mantine/modals";
import type { SaveSupplierRequest } from "@/services/SupplierService/types/SupplierRequest";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { ROUTE_PATHS } from "@/router/routePaths";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { usePermission } from "@/hooks/auth/usePermission";
import { tMenu } from "@/consts/translations/tMenu";
import { tBasic } from "@/consts/translations/tBasic";
import { tSupplierList } from "@/consts/translations/tSupplierList";
import { useTranslation } from "@/hooks/translation/useTranslation";

export const SupplierPage = () => {
  const t = useTranslation();
  const { canCreate, canUpdate, canDelete } = usePermission("supplier");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierList | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const pagination = usePaginationState();
  const sortHandler = useTableSort("name", "asc");

  const { suppliers, isLoadingInitialData, isReloading, reloadSupplierList } =
    useLoadInitialData({
      search: debouncedSearch,
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sortHandler.sortBy,
      orderBy: sortHandler.orderBy,
      setTotalPage: pagination.setTotalPage,
      setTotalCount: pagination.setTotalCount,
      setPage: pagination.setPage,
    });

  const handleDelete = (supplier: SupplierList) => {
    const confirmTexts = tBasic.confirmModalDelete(t(tSupplierList.supplier));
    modals.openConfirmModal({
      title: t(confirmTexts.title),
      centered: true,
      children: (
        <Text size="sm">
          {t(confirmTexts.message)} <strong>{supplier.name}</strong>
        </Text>
      ),
      labels: { confirm: t(tBasic.textDelete), cancel: t(tBasic.textCancel) },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const response = await SupplierService.deleteSupplier(
          supplier.supplier_id,
        );
        if (!response.ok) {
          NotificationUtil.notifyError({
            title: t(tBasic.notifyDeleteError(t(tSupplierList.supplier))),
            message: response.message,
          });
          return;
        }
        await reloadSupplierList();
      },
    });
  };

  const handleSave = async (values: SaveSupplierRequest) => {
    setIsSaving(true);
    const response = await SupplierService.saveSupplier({
      ...values,
      supplier_id: selectedSupplier?.supplier_id,
    });

    if (!response.ok) {
      const errFn = selectedSupplier
        ? tBasic.notifyUpdateError
        : tBasic.notifyCreateError;
      NotificationUtil.notifyError({
        title: t(errFn(t(tSupplierList.supplier))),
        message: response.message,
      });
      setIsSaving(false);
      return;
    }
    await reloadSupplierList();
    setDrawerOpened(false);
    setIsSaving(false);
  };

  return (
    <PageLayout
      isLoading={isLoadingInitialData}
      breadcrumbs={{ label: tMenu.supplier, path: ROUTE_PATHS.SUPPLIERS }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              {t(tSupplierList.title)}
            </Title>
            <Text c="gray.6" fz="sm">
              {t(tSupplierList.description)}
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder={t(tSupplierList.searchPlaceholder)}
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 300 }}
            />
            <RefreshButton onClick={async () => await reloadSupplierList()} />
            {canCreate && (
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => {
                  setSelectedSupplier(null);
                  setDrawerOpened(true);
                }}
              >
                {t(tBasic.textAddNew)}
              </Button>
            )}
          </Group>
        </Group>

        <SupplierListTable
          records={suppliers}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={
            canUpdate
              ? (supplier: SupplierList) => {
                  setSelectedSupplier(supplier);
                  setDrawerOpened(true);
                }
              : undefined
          }
          onDelete={canDelete ? handleDelete : undefined}
          isLoading={isReloading}
        />

        <SupplierFormDrawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          supplier={selectedSupplier}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </Stack>
    </PageLayout>
  );
};
