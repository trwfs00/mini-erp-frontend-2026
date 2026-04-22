import { PageLayout } from "@/components/layouts/page";
import { SupplierListTable } from "@/components/tables/supplier-list-table";
import { useLoadSupplierData } from "@/pages/supplier/hooks/use-load-supplier-data";
import { Stack, Text, Title, Group, TextInput, Button } from "@mantine/core";
import { Search, Plus } from "lucide-react";
import type { SupplierList } from "@/types/supplier/supplier-list";
import { useState } from "react";
import { SupplierService } from "@/services/supplier-service";
import { RefreshButton } from "@/components/refresh-button";
import { useDebouncedValue } from "@mantine/hooks";
import { SupplierFormDrawer } from "./components/supplier-form-drawer";
import { modals } from "@mantine/modals";
import type { SupplierFormValues } from "@/schemas/supplier-schema";
import type { SaveSupplierRequest } from "@/services/supplier-service/types/supplier-request";

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

  const handleRefresh = async () => {
    await reloadSuppliers();
  };

  const handleEdit = (supplier: SupplierList) => {
    setSelectedSupplier(supplier);
    setDrawerOpened(true);
  };

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
        try {
          await SupplierService.deleteSupplier(supplier.supplier_id);
          await reloadSuppliers();
        } catch (error) {
          console.error("Failed to delete supplier:", error);
        }
      },
    });
  };

  const handleSave = async (values: SupplierFormValues) => {
    setIsSaving(true);
    try {
      await SupplierService.saveSupplier({
        ...values,
        supplier_id: selectedSupplier?.supplier_id,
      } as SaveSupplierRequest);
      await reloadSuppliers();
      setDrawerOpened(false);
    } catch (error) {
      console.error("Failed to save supplier:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = () => {
    setSelectedSupplier(null);
    setDrawerOpened(true);
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
            <RefreshButton onClick={handleRefresh} />
            <Button leftSection={<Plus size={16} />} onClick={handleCreate}>
              Add Supplier
            </Button>
          </Group>
        </Group>

        <SupplierListTable
          records={suppliers}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={handleEdit}
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
