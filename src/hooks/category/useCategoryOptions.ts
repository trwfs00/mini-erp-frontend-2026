import { useState, useEffect } from "react";
import { CategoryService } from "@/services/CategoryService";

type CategoryOption = {
  value: string;
  label: string;
};

export const useCategoryOptions = () => {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const response = await CategoryService.getCategoryList({
        criteria: {},
        page: 1,
        limit: 100,
        sort_bys: [{ field: "name", direction: "asc" }],
      });

      if (response.ok && response.data) {
        setOptions(
          response.data.data.map((c) => ({
            value: c.category_id,
            label: c.name,
          })),
        );
      } else {
        console.error("Failed to load category options:", response.message);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  return { options, isLoading };
};
