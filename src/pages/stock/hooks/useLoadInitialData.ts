import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import type {
  StockTransaction,
  TransactionType,
} from "@/types/stock/StockTransaction";
import type { OrderBy } from "@/types/SortOrder";
import { NotificationUtil } from "@/utils/NotificationUtil";
// TODO: เปลี่ยนเป็น dropdown hook จริงเมื่อ integrate API
import { useMockProductDropdown } from "@/hooks/dropdown/useMockProductDropdown";
// TODO: ลบ useMockStockData เมื่อ integrate API จริง
import { useMockStockData } from "./useMockStockData";
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

  // TODO: ลบ useMockStockData เมื่อ integrate API จริง
  const { getMockTransactionList } = useMockStockData();

  // Dropdown hooks
  // TODO: เปลี่ยนเป็น dropdown hook จริงเมื่อ integrate API
  const { productOptions, callGetProductDropdown } = useMockProductDropdown();

  // Stock summary (reactive ตาม productFilter)
  const { summary, fetchSummary, clearSummary } = useStockSummary();

  const callGetTransactionList = async (): Promise<boolean> => {
    setTransactions([]);
    // TODO: เปลี่ยนเป็น StockService.getTransactionList เมื่อ integrate API จริง
    const response = await getMockTransactionList({
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

  // CRITICAL: Run once on mount only
  useEffect(() => {
    loadInitialData();
  }, []);

  // CRITICAL: Run when page, limit, sortBy, or orderBy changes
  useDidUpdate(() => {
    reloadTransactions();
  }, [page, limit, sortBy, orderBy]);

  // เฝ้า search + filter แยก เพราะต้องการ handle กรณีย้อนกลับมาหน้า 1
  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadTransactions();
    }
  }, [search, typeFilter, productFilter]);

  // โหลด stock summary เมื่อมี productFilter
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
