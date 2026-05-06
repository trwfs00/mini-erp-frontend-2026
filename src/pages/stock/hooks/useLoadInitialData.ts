import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import { StockService } from "@/services/StockService";
import { useProducts } from "@/hooks/dropdown/useProduct";
import type {
  StockTransaction,
  TransactionType,
} from "@/types/stock/StockTransaction";
import type { OrderBy } from "@/types/SortOrder";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { useStockSummary } from "./useStockSummary";

type Params = {
  page: number;
  limit: number;
  search: string;
  typeFilter: TransactionType | "";
  productFilter: string;
  sortBy: string | null;
  orderBy: OrderBy;
  setTotalPage: (total: number) => void;
  setTotalCount: (count: number) => void;
  setPage: (page: number) => void;
};

export const useLoadInitialData = ({
  page,
  limit,
  search,
  typeFilter,
  productFilter,
  sortBy,
  orderBy,
  setTotalPage,
  setTotalCount,
  setPage,
}: Params) => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  const { productOptions, callGetProductDropdown } = useProducts();
  const { summary, fetchSummary, clearSummary } = useStockSummary();

  const callGetTransactionList = async (): Promise<boolean> => {
    setTransactions([]);
    const response = await StockService.getTransactionList({
      criteria: {
        search: search || undefined,
        type: typeFilter === "" ? undefined : typeFilter,
        product_id: productFilter === "" ? undefined : productFilter,
      },
      page,
      limit,
      sort_bys:
        sortBy && orderBy ? [{ field: sortBy, direction: orderBy }] : [],
    });

    if (!response.ok) return false;

    setTransactions(response.data.data);
    setTotalPage(response.data.pagination.total_page);
    setTotalCount(response.data.pagination.total_count);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);

    const promises = [callGetTransactionList(), callGetProductDropdown()];
    const results = await Promise.all(promises);

    setIsLoadingInitialData(false);

    if (results.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadTransactions = async (): Promise<boolean> => {
    setIsReloading(true);
    const success = await callGetTransactionList();
    setIsReloading(false);

    if (!success) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
    return success;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useDidUpdate(() => {
    reloadTransactions();
  }, [page, limit, sortBy, orderBy]);

  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadTransactions();
    }
  }, [search, typeFilter, productFilter]);

  useDeepEqualDidUpdate(() => {
    if (productFilter) {
      fetchSummary(productFilter);
    } else {
      clearSummary();
    }
  }, [productFilter]);

  return {
    isLoadingInitialData,
    isReloading,
    transactions,
    productOptions,
    summary,
    fetchSummary,
    reloadTransactions,
  };
};
