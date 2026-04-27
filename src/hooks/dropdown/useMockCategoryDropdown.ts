// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import type { CategoryDropdown } from "@/types/category/CategoryDropdown";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type { ComboboxData } from "@mantine/core";
import { useState } from "react";

const MOCK_CATEGORY_DROPDOWN: CategoryDropdown[] = [
  { category_id: "cat1", name: "Beverages" },
  { category_id: "cat2", name: "Food" },
  { category_id: "cat3", name: "Snacks" },
  { category_id: "cat4", name: "Dairy" },
  { category_id: "cat5", name: "Bakery" },
  { category_id: "cat6", name: "Frozen Foods" },
  { category_id: "cat7", name: "Produce" },
  { category_id: "cat8", name: "Condiments" },
];

export const useMockCategoryDropdown = () => {
  const [categories, setCategories] = useState<CategoryDropdown[]>([]);

  const callGetCategoryDropdown = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setCategories(MOCK_CATEGORY_DROPDOWN);
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
