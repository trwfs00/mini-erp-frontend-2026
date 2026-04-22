import { PageLayout } from "@/components/layouts/page";
import { ProductListTable } from "@/components/tables/product-list-table";
import { useClientTableData } from "@/hooks/table/use-client-table-data";
import { Stack, Text, Title, Group, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import type { ProductList } from "@/types/product/product-list";
import { useEffect, useState, useCallback } from "react";
import { ProductService } from "@/services/product-service";
import { RefreshButton } from "@/components/refresh-button";
import { useDebouncedValue } from "@mantine/hooks";

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);

  const { records, pagination, sortHandler } =
    useClientTableData<ProductList>(products);

  const fetchProducts = useCallback(async (searchQuery: string) => {
    try {
      const response = await ProductService.getProductList({
        criteria: { search: searchQuery },
        sort_bys: [],
        page: 1,
        limit: 100, // Fetch standard size for client-table
      });
      if (response.ok && response.data) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [fetchProducts, debouncedSearch]);

  const handleRefresh = async () => {
    await fetchProducts(debouncedSearch);
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
            <RefreshButton onClick={handleRefresh} />
          </Group>
        </Group>

        <ProductListTable
          records={records}
          pagination={pagination}
          sortHandler={sortHandler}
        />
      </Stack>
    </PageLayout>
  );
};

export default ProductsPage;
