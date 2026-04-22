import { useState, useEffect } from "react";
import { CategoryService } from "@/services/category-service";

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
      try {
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
        }
      } catch (error) {
        console.error("Failed to load category options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { options, isLoading };
};
