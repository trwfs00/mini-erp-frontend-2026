import { PageLayout } from "@/components/Layouts/Page";
import { CategoryListTable } from "@/components/Tables/CategoryListTable";
import { Stack, Text, Title, Group, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import type { CategoryList } from "@/types/category/CategoryList";
import { useState } from "react";
import { CategoryService } from "@/services/CategoryService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { Button } from "@mantine/core";
import { Plus } from "lucide-react";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { modals } from "@mantine/modals";
import type { SaveCategoryRequest } from "@/services/CategoryService/types/CategoryRequest";
import { CategoryFormDrawer } from "./components/CategoryFormDrawer";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { ROUTE_PATHS } from "@/router/routePaths";
import { usePermission } from "@/hooks/auth/usePermission";
import { tMenu } from "@/consts/translations/tMenu";
import { tBasic } from "@/consts/translations/tBasic";
import { tCategoryList } from "@/consts/translations/tCategoryList";
import { useTranslation } from "@/hooks/translation/useTranslation";

export const CategoryPage = () => {
  const t = useTranslation();
  const { canCreate, canUpdate, canDelete } = usePermission("category");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryList | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const pagination = usePaginationState();
  const sortHandler = useTableSort();

  const { categories, isLoadingInitialData, isReloading, reloadCategoryList } =
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

  const handleDelete = (category: CategoryList) => {
    const confirmTexts = tBasic.confirmModalDelete(t(tCategoryList.category));
    modals.openConfirmModal({
      title: t(confirmTexts.title),
      centered: true,
      children: (
        <Text size="sm">
          {t(confirmTexts.message)} <strong>{category.name}</strong>
        </Text>
      ),
      labels: { confirm: t(tBasic.textDelete), cancel: t(tBasic.textCancel) },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const response = await CategoryService.deleteCategory(
          category.category_id,
        );
        if (!response.ok) {
          NotificationUtil.notifyError({
            title: t(tBasic.notifyDeleteError(t(tCategoryList.category))),
            message: response.message,
          });
        }
      },
    });
  };

  const handleSave = async (values: SaveCategoryRequest) => {
    setIsSaving(true);
    const response = await CategoryService.saveCategory({
      ...values,
      category_id: selectedCategory?.category_id,
    });

    if (!response.ok) {
      const errFn = selectedCategory
        ? tBasic.notifyUpdateError
        : tBasic.notifyCreateError;
      NotificationUtil.notifyError({
        title: t(errFn(t(tCategoryList.category))),
        message: response.message,
      });
    }
    setIsSaving(false);
  };

  return (
    <PageLayout
      isLoading={isLoadingInitialData}
      breadcrumbs={{ label: tMenu.category, path: ROUTE_PATHS.CATEGORY }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700}>
              {t(tCategoryList.title)}
            </Title>
            <Text c="dimmed" fz="sm">
              {t(tCategoryList.description)}
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder={t(tCategoryList.searchPlaceholder)}
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 250 }}
            />
            <RefreshButton onClick={async () => await reloadCategoryList()} />
            {canCreate && (
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => {
                  setSelectedCategory(null);
                  setDrawerOpened(true);
                }}
              >
                {t(tBasic.textAddNew)}
              </Button>
            )}
          </Group>
        </Group>

        <CategoryListTable
          records={categories}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={
            canUpdate
              ? (category: CategoryList) => {
                  setSelectedCategory(category);
                  setDrawerOpened(true);
                }
              : undefined
          }
          onDelete={canDelete ? handleDelete : undefined}
          isLoading={isReloading}
          isLoadingInitial={isLoadingInitialData}
        />

        <CategoryFormDrawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          category={selectedCategory}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </Stack>
    </PageLayout>
  );
};
