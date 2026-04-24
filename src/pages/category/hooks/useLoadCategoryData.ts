import { useState, useEffect } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { CategoryService } from "@/services/CategoryService";
import type { CategoryList } from "@/types/category/CategoryList";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";

export const useLoadCategoryData = (search: string) => {
  const [categories, setCategories] = useState<CategoryList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort("name", "asc");

  const { page, limit, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = async () => {
    setIsLoading(true);
    const response = await CategoryService.getCategoryList({
      criteria: { search },
      limit,
      page,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    if (response.ok && response.data) {
      setCategories(response.data.data);
      setTotalPage(response.data.pagination.total_page);
      setTotalCount(response.data.pagination.total_count);
    } else {
      console.error("Failed to load categories", response.message);
    }
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // When pagination or sort changes
  useDidUpdate(() => {
    loadData();
  }, [page, limit, sortBy, orderBy]);

  // When search changes, reset page to 1 or reload if already on page 1
  useDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      loadData();
    }
  }, [search]);

  return {
    categories,
    isLoading,
    pagination,
    sortHandler,
    reloadCategories: loadData,
  };
};
