import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { ReportService } from "@/services/ReportService";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { compareValues } from "@/utils/SortUtil";
import type {
  StockSummaryReport,
  StockSummaryRow,
  StockSummaryTotals,
} from "@/types/report/StockSummary";

const EMPTY_TOTALS: StockSummaryTotals = {
  total_products: 0,
  total_cost_value: 0,
  total_selling_value: 0,
  low_stock_count: 0,
};

export const useLoadStockSummaryData = () => {
  const [stockSummary, setStockSummary] = useState<StockSummaryReport | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort(null, null);

  const { limit, page, setTotalCount, setTotalPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = async () => {
    setIsLoading(true);
    const response = await ReportService.getStockSummary();
    if (response.ok && response.data) {
      setStockSummary(response.data);
      setTotalCount(response.data.rows.length);
      setTotalPage(Math.ceil(response.data.rows.length / limit));
    } else {
      console.error("Failed to load stock summary", response.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useDidUpdate(() => {
    if (stockSummary) {
      setTotalPage(Math.ceil(stockSummary.rows.length / limit));
    }
  }, [limit]);

  const rows: StockSummaryRow[] = (() => {
    if (!stockSummary) return [];
    let sorted = [...stockSummary.rows];
    if (sortBy && orderBy) {
      sorted.sort((a, b) => {
        const cmp = compareValues(
          a[sortBy as keyof StockSummaryRow],
          b[sortBy as keyof StockSummaryRow],
        );
        return orderBy === "asc" ? cmp : -cmp;
      });
    }
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  })();

  return {
    stockSummary,
    totals: stockSummary?.totals ?? EMPTY_TOTALS,
    rows,
    isLoading,
    pagination,
    sortHandler,
    reloadStockSummary: loadData,
  };
};
