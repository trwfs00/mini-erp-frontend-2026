import { PageLayout } from "@/components/Layouts/Page";
import { CategoryListTable } from "@/components/Tables/CategoryListTable";
import { useLoadCategoryData } from "@/pages/category/hooks/useLoadCategoryData";
import { Stack, Text, Title, Group, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import type { CategoryList } from "@/types/category/CategoryList";
import { useState } from "react";
import { CategoryService } from "@/services/CategoryService";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { Button } from "@mantine/core";
import { Plus } from "lucide-react";
import { CategoryFormDrawer } from "./components/CategoryFormDrawer";
import { modals } from "@mantine/modals";
import type { CategoryFormValues } from "@/schemas/categorySchema";
import type { SaveCategoryRequest } from "@/services/CategoryService/types/CategoryRequest";

const CategoryPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryList | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { categories, pagination, sortHandler, reloadCategories, isLoading } =
    useLoadCategoryData(debouncedSearch);

  const handleDelete = (category: CategoryList) => {
    modals.openConfirmModal({
      title: "Delete Category",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{category.name}</strong>? This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const response = await CategoryService.deleteCategory(
          category.category_id,
        );
        if (response.ok) {
          await reloadCategories();
        } else {
          console.error("Failed to delete category:", response.message);
        }
      },
    });
  };

  const handleSave = async (values: CategoryFormValues) => {
    setIsSaving(true);
    const response = await CategoryService.saveCategory({
      ...values,
      category_id: selectedCategory?.category_id,
    } as SaveCategoryRequest);

    if (response.ok) {
      await reloadCategories();
      setDrawerOpened(false);
    } else {
      console.error("Failed to save category:", response.message);
    }
    setIsSaving(false);
  };

  return (
    <PageLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              Categories
            </Title>
            <Text c="gray.6" fz="sm">
              Organize products into categories.
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder="Search by name or description..."
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 280 }}
            />
            <RefreshButton
              onClick={async () => {
                await reloadCategories();
              }}
            />
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => {
                setSelectedCategory(null);
                setDrawerOpened(true);
              }}
            >
              Add Category
            </Button>
          </Group>
        </Group>

        <CategoryListTable
          records={categories}
          pagination={pagination}
          sortHandler={sortHandler}
          onEdit={(category: CategoryList) => {
            setSelectedCategory(category);
            setDrawerOpened(true);
          }}
          onDelete={handleDelete}
          isLoading={isLoading}
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

export default CategoryPage;
