import { PageLayout } from "@/components/Layouts/Page";
import { SupplierListTable } from "@/components/Tables/SupplierListTable";
import { useLoadSupplierData } from "@/pages/supplier/hooks/useLoadSupplierData";
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

const SupplierPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierList | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { suppliers, pagination, sortHandler, reloadSuppliers, isLoading } =
    useLoadSupplierData(debouncedSearch);

  const handleDelete = (supplier: SupplierList) => {
    modals.openConfirmModal({
      title: "Delete Supplier",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{supplier.name}</strong>? This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const response = await SupplierService.deleteSupplier(
          supplier.supplier_id,
        );
        if (!response.ok) {
          NotificationUtil.notifyError({
            title: "Failed to delete supplier",
          });
          return;
        }
        await reloadSuppliers();
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
      NotificationUtil.notifyError({
        title: "Failed to save supplier",
      });
      return;
    }
    await reloadSuppliers();
    setDrawerOpened(false);
    setIsSaving(false);
  };

  return (
    <PageLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              Suppliers
            </Title>
            <Text c="gray.6" fz="sm">
              Manage your supplier relationships.
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder="Search by name, email or phone..."
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 300 }}
            />
            <RefreshButton
              onClick={async () => {
                await reloadSuppliers();
              }}
            />
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => {
                setSelectedSupplier(null);
                setDrawerOpened(true);
              }}
            >
              Add Supplier
            </Button>
          </Group>
        </Group>

        <SupplierListTable
          records={suppliers}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={(supplier: SupplierList) => {
            setSelectedSupplier(supplier);
            setDrawerOpened(true);
          }}
          onDelete={handleDelete}
          isLoading={isLoading}
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

export default SupplierPage;
