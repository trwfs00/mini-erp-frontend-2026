import { useCallback, useEffect, useMemo, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { ReportService } from "@/services/ReportService";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { compareValues } from "@/utils/SortUtil";
import type {
  StockMovementReport,
  StockMovementRow,
  StockMovementDailyPoint,
} from "@/types/report/StockMovementReport";

const EMPTY_TOTALS = { total_in: 0, total_out: 0, total_adjust: 0 };
const EMPTY_DAILY: StockMovementDailyPoint[] = [];

type Range = {
  from: string;
  to: string;
};

export const useLoadStockMovementData = (range: Range) => {
  const [stockMovement, setStockMovement] = useState<StockMovementReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pagination = usePaginationState(1, 10);
  const sortHandler = useTableSort("created_at", "desc");

  const { limit, page, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const response = await ReportService.getStockMovement(range);
    if (response.ok && response.data) {
      setStockMovement(response.data);
      setTotalCount(response.data.rows.length);
      setTotalPage(Math.ceil(response.data.rows.length / limit));
    } else {
      console.error("Failed to load stock movement", response.message);
    }
    setIsLoading(false);
  }, [range, limit, setTotalCount, setTotalPage]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      loadData();
    }
  }, [range.from, range.to]);

  useDidUpdate(() => {
    if (stockMovement) {
      setTotalPage(Math.ceil(stockMovement.rows.length / limit));
    }
  }, [limit]);

  const rows: StockMovementRow[] = useMemo(() => {
    if (!stockMovement) return [];
    let sorted = [...stockMovement.rows];
    if (sortBy && orderBy) {
      sorted.sort((a, b) => {
        const cmp = compareValues(
          a[sortBy as keyof StockMovementRow],
          b[sortBy as keyof StockMovementRow],
        );
        return orderBy === "asc" ? cmp : -cmp;
      });
    }
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  }, [stockMovement, sortBy, orderBy, page, limit]);

  return {
    stockMovement,
    totals: stockMovement?.totals ?? EMPTY_TOTALS,
    daily: stockMovement?.daily ?? EMPTY_DAILY,
    rows,
    isLoading,
    pagination,
    sortHandler,
    reloadStockMovement: loadData,
  };
};
