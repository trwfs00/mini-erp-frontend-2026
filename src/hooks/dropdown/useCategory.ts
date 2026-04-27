import { CategoryService } from "@/services/CategoryService";
import { ProductService } from "@/services/ProductService";
import type { CategoryDropdown } from "@/types/category/CategoryDropdown";
import type { ComboboxData } from "@mantine/core";
import { useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDropdown[]>([]);

  const callGetCategoryDropdown = async (): Promise<boolean> => {
    const response = await CategoryService.getCategoryForDropdown();

    if (!response.ok) {
      return false;
    }

    setCategories(response.data || []);
    return true;
  };

  const categoryOptions: ComboboxData = categories.map((item) => ({
    value: item.category_id,
    label: item.name,
  }));

  return {
    categories,
    categoryOptions,
    callGetCategoryDropdown,
  };
};
