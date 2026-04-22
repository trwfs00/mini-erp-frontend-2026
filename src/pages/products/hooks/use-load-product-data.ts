import { useState, useCallback, useEffect } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { ProductService } from "@/services/product-service";
import type { ProductList } from "@/types/product/product-list";
import { usePaginationState } from "@/hooks/pagination/use-pagination-state";
import { useTableSort } from "@/hooks/table/use-table-sort";

export const useLoadProductData = (search: string) => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort();

  const { page, limit, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ProductService.getProductList({
        criteria: { search },
        limit,
        page,
        sort_bys: sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
      });

      if (response.ok && response.data) {
        setProducts(response.data.data);
        setTotalPage(response.data.pagination.total_page);
        setTotalCount(response.data.pagination.total_count);
      }
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
    }
  }, [search, limit, page, sortBy, orderBy, setTotalCount, setTotalPage]);

  // Initial Load
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When pagination or sort changes
  useDidUpdate(() => {
    loadData();
  }, [page, limit, sortBy, orderBy]);

  // When search changes, reset page to 1 or reload if already on page 1
  useDidUpdate(() => {
    if (page > 1) {
      setPage(1); // This will trigger the pagination useDidUpdate to loadData
    } else {
      loadData();
    }
  }, [search]);

  return {
    products,
    isLoading,
    pagination,
    sortHandler,
    reloadProducts: loadData,
  };
};
