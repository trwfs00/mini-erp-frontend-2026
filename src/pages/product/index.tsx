import { PageLayout } from "@/components/Layouts/Page";
import { ProductListTable } from "@/components/Tables/ProductListTable";
import { useLoadProductData } from "@/pages/product/hooks/useLoadProductData";
import { Stack, Text, Title, Group, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import type { ProductList } from "@/types/product/ProductList";
import { useState } from "react";
import { ProductService } from "@/services/ProductService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { Button } from "@mantine/core";
import { Plus } from "lucide-react";
import { ProductFormDrawer } from "./components/ProductFormDrawer";
import { modals } from "@mantine/modals";
import type { ProductFormValues } from "@/schemas/productSchema";
import type { SaveProductRequest } from "@/services/ProductService/types/ProductRequest";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductList | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { products, pagination, sortHandler, reloadProducts, isLoading } =
    useLoadProductData(debouncedSearch);

  const handleDelete = (product: ProductList) => {
    modals.openConfirmModal({
      title: "Delete Product",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{product.name}</strong>? This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const response = await ProductService.deleteProduct(product.product_id);
        if (response.ok) {
          await reloadProducts();
        } else {
          console.error("Failed to delete product:", response.message);
        }
      },
    });
  };

  const handleSave = async (values: ProductFormValues) => {
    setIsSaving(true);
    const response = await ProductService.saveProduct({
      ...values,
      product_id: selectedProduct?.product_id, // include ID if editing
    } as SaveProductRequest);

    if (response.ok) {
      await reloadProducts();
      setDrawerOpened(false);
    } else {
      console.error("Failed to save product:", response.message);
    }
    setIsSaving(false);
  };

  return (
    <PageLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              Products
            </Title>
            <Text c="gray.6" fz="sm">
              Manage your product catalog.
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder="Search by name or sku..."
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 250 }}
            />
            <RefreshButton onClick={async () => await reloadProducts()} />
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => {
                setSelectedProduct(null);
                setDrawerOpened(true);
              }}
            >
              Add Product
            </Button>
          </Group>
        </Group>

        <ProductListTable
          records={products}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={(product) => {
            setSelectedProduct(product);
            setDrawerOpened(true);
          }}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        <ProductFormDrawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          product={selectedProduct}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </Stack>
    </PageLayout>
  );
};

export default ProductsPage;
