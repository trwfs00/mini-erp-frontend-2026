import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { ReportService } from "@/services/ReportService";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { compareValues } from "@/utils/SortUtil";
import type {
  PurchaseSummaryReport,
  PurchaseSummaryRow,
} from "@/types/report/PurchaseSummary";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

const EMPTY_TOTALS = {
  total_orders: 0,
  total_amount: 0,
  by_status: {
    DRAFT: 0,
    CONFIRMED: 0,
    RECEIVED: 0,
    CANCELLED: 0,
  } as Record<PurchaseOrderStatus, number>,
};

export const useLoadPurchaseSummaryData = (month: string) => {
  const [purchaseSummary, setPurchaseSummary] =
    useState<PurchaseSummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort("created_at", "desc");

  const { limit, page, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = async () => {
    setIsLoading(true);
    const response = await ReportService.getPurchaseSummary({ month });
    if (response.ok && response.data) {
      setPurchaseSummary(response.data);
      setTotalCount(response.data.rows.length);
      setTotalPage(Math.ceil(response.data.rows.length / limit));
    } else {
      console.error("Failed to load purchase summary", response.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      loadData();
    }
  }, [month]);

  useDidUpdate(() => {
    if (purchaseSummary) {
      setTotalPage(Math.ceil(purchaseSummary.rows.length / limit));
    }
  }, [limit]);

  const rows: PurchaseSummaryRow[] = (() => {
    if (!purchaseSummary) return [];
    let sorted = [...purchaseSummary.rows];
    if (sortBy && orderBy) {
      sorted.sort((a, b) => {
        const cmp = compareValues(
          a[sortBy as keyof PurchaseSummaryRow],
          b[sortBy as keyof PurchaseSummaryRow],
        );
        return orderBy === "asc" ? cmp : -cmp;
      });
    }
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  })();

  return {
    purchaseSummary,
    totals: purchaseSummary?.totals ?? EMPTY_TOTALS,
    rows,
    isLoading,
    pagination,
    sortHandler,
    reloadPurchaseSummary: loadData,
  };
};
