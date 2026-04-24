import { useState, useEffect } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { StockService } from "@/services/StockService";
import type {
  StockTransaction,
  TransactionType,
} from "@/types/stock/StockTransaction";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";

type FilterCriteria = {
  search: string;
  type: TransactionType | "";
  product_id: string;
};

export const useLoadStockTransactions = (filters: FilterCriteria) => {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort("created_at", "desc");

  const { page, limit, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = async () => {
    setIsLoading(true);
    const response = await StockService.getTransactionList({
      criteria: {
        search: filters.search,
        type: filters.type === "" ? undefined : filters.type,
        product_id: filters.product_id === "" ? undefined : filters.product_id,
      },
      limit,
      page,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    if (response.ok && response.data) {
      setTransactions(response.data.data);
      setTotalPage(response.data.pagination.total_page);
      setTotalCount(response.data.pagination.total_count);
    } else {
      console.error("Failed to load transactions", response.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useDidUpdate(() => {
    loadData();
  }, [page, limit, sortBy, orderBy]);

  useDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      loadData();
    }
  }, [filters.search, filters.type, filters.product_id]);

  return {
    transactions,
    isLoading,
    pagination,
    sortHandler,
    reloadTransactions: loadData,
  };
};
