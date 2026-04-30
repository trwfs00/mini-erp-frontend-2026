import { PageLayout } from "@/components/Layouts/Page";
import { ProductListTable } from "@/components/Tables/ProductListTable";
import { useLoadInitialData } from "@/pages/product/hooks/useLoadInitialData";
import { Stack, Text, Title, Group, TextInput, Button } from "@mantine/core";
import { Search, Plus } from "lucide-react";
import type { ProductList } from "@/types/product/ProductList";
import { useState } from "react";
import { ProductService } from "@/services/ProductService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { ProductFormDrawer } from "./components/ProductFormDrawer";
import { modals } from "@mantine/modals";
import type { ProductFormValues } from "@/schemas/productSchema";
import type { SaveProductRequest } from "@/services/ProductService/types/ProductRequest";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { ROUTE_PATHS } from "@/router/routePaths";
import { usePermission } from "@/hooks/auth/usePermission";
import { tMenu } from "@/consts/translations/tMenu";
import { tBasic } from "@/consts/translations/tBasic";
import { tProductList } from "@/consts/translations/tProductList";
import { useTranslation } from "@/hooks/translation/useTranslation";

export const ProductsPage = () => {
  const t = useTranslation();
  const { canCreate, canUpdate, canDelete } = usePermission("product");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductList | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const pagination = usePaginationState();
  const sortHandler = useTableSort("name", "asc");

  const { products, isLoadingInitialData, isReloading, reloadProductList } =
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

  const handleDelete = (product: ProductList) => {
    const confirmTexts = tBasic.confirmModalDelete(t(tProductList.product));
    modals.openConfirmModal({
      title: t(confirmTexts.title),
      centered: true,
      children: (
        <Text size="sm">
          {t(confirmTexts.message)} <strong>{product.name}</strong>
        </Text>
      ),
      labels: { confirm: t(tBasic.textDelete), cancel: t(tBasic.textCancel) },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const response = await ProductService.deleteProduct(product.product_id);
        if (response.ok) {
          await reloadProductList();
        } else {
          NotificationUtil.notifyError({
            title: t(tBasic.notifyDeleteError(t(tProductList.product))),
            message: response.message,
          });
        }
      },
    });
  };

  const handleSave = async (values: ProductFormValues) => {
    setIsSaving(true);
    const response = await ProductService.saveProduct({
      ...values,
      product_id: selectedProduct?.product_id,
    } as SaveProductRequest);

    if (response.ok) {
      await reloadProductList();
      setDrawerOpened(false);
    } else {
      const errFn = selectedProduct
        ? tBasic.notifyUpdateError
        : tBasic.notifyCreateError;
      NotificationUtil.notifyError({
        title: t(errFn(t(tProductList.product))),
        message: response.message,
      });
    }
    setIsSaving(false);
  };

  return (
    <PageLayout
      isLoading={isLoadingInitialData}
      breadcrumbs={{ label: tMenu.product, path: ROUTE_PATHS.PRODUCT }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              {t(tProductList.title)}
            </Title>
            <Text c="gray.6" fz="sm">
              {t(tProductList.description)}
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder={t(tProductList.searchPlaceholder)}
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 250 }}
            />
            <RefreshButton onClick={async () => await reloadProductList()} />
            {canCreate && (
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => {
                  setSelectedProduct(null);
                  setDrawerOpened(true);
                }}
              >
                {t(tBasic.textAddNew)}
              </Button>
            )}
          </Group>
        </Group>

        <ProductListTable
          records={products}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={
            canUpdate
              ? (product) => {
                  setSelectedProduct(product);
                  setDrawerOpened(true);
                }
              : undefined
          }
          onDelete={canDelete ? handleDelete : undefined}
          isLoading={isReloading}
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
