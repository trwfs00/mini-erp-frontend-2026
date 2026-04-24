import { useState, useEffect } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { SupplierService } from "@/services/SupplierService";
import type { SupplierList } from "@/types/supplier/SupplierList";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";

export const useLoadSupplierData = (search: string) => {
  const [suppliers, setSuppliers] = useState<SupplierList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort("name", "asc");

  const { page, limit, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = async () => {
    setIsLoading(true);
    const response = await SupplierService.getSupplierList({
      criteria: { search },
      limit,
      page,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    if (response.ok && response.data) {
      setSuppliers(response.data.data);
      setTotalPage(response.data.pagination.total_page);
      setTotalCount(response.data.pagination.total_count);
    } else {
      console.error("Failed to load suppliers", response.message);
    }
    setIsLoading(false);
  };

  // Initial Load
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
    suppliers,
    isLoading,
    pagination,
    sortHandler,
    reloadSuppliers: loadData,
  };
};
