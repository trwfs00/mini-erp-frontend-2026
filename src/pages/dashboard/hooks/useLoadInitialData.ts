import { useState, useEffect, useCallback } from "react";
import { useMockDashboardData } from "./useMockDashboardData";
import type {
  DashboardSummary,
  LowStockProduct,
} from "@/types/dashboard/DashboardDetail";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";
import { NotificationUtil } from "@/utils/NotificationUtil";

export type SectionState<T> = {
  data: T | null;
  isLoading: boolean;
  reload: () => Promise<boolean>;
};

export const useLoadInitialData = () => {
  // TODO: เปลี่ยนเป็น DashboardService methods เมื่อ integrate API จริง
  const {
    getMockSummary,
    getMockStockMovement,
    getMockPurchaseTrend,
    getMockLowStock,
  } = useMockDashboardData();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [movement, setMovement] = useState<StockMovementDailyPoint[] | null>(
    null,
  );
  const [trend, setTrend] = useState<PurchaseTrendPoint[] | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[] | null>(null);

  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingMovement, setIsLoadingMovement] = useState(true);
  const [isLoadingTrend, setIsLoadingTrend] = useState(true);
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(true);

  const loadSummary = useCallback(async (): Promise<boolean> => {
    setIsLoadingSummary(true);
    try {
      const res = await getMockSummary();
      setSummary(res.data);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoadingSummary(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMovement = useCallback(async (): Promise<boolean> => {
    setIsLoadingMovement(true);
    try {
      const res = await getMockStockMovement();
      setMovement(res.data);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoadingMovement(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrend = useCallback(async (): Promise<boolean> => {
    setIsLoadingTrend(true);
    try {
      const res = await getMockPurchaseTrend();
      setTrend(res.data);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoadingTrend(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLowStock = useCallback(async (): Promise<boolean> => {
    setIsLoadingLowStock(true);
    try {
      const res = await getMockLowStock();
      setLowStock(res.data);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoadingLowStock(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadAll = useCallback(async (): Promise<void> => {
    const results = await Promise.allSettled([
      loadSummary(),
      loadMovement(),
      loadTrend(),
      loadLowStock(),
    ]);

    const anyFailed = results.some(
      (r) => r.status === "rejected" || r.value === false,
    );
    if (anyFailed) {
      NotificationUtil.notifyError({
        title: "Some sections failed to load",
      });
    }
  }, [loadSummary, loadMovement, loadTrend, loadLowStock]);

  useEffect(() => {
    reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    summary: {
      data: summary,
      isLoading: isLoadingSummary,
      reload: loadSummary,
    } as SectionState<DashboardSummary>,
    movement: {
      data: movement,
      isLoading: isLoadingMovement,
      reload: loadMovement,
    } as SectionState<StockMovementDailyPoint[]>,
    trend: {
      data: trend,
      isLoading: isLoadingTrend,
      reload: loadTrend,
    } as SectionState<PurchaseTrendPoint[]>,
    lowStock: {
      data: lowStock,
      isLoading: isLoadingLowStock,
      reload: loadLowStock,
    } as SectionState<LowStockProduct[]>,
    reloadAll,
    isAnyLoading:
      isLoadingSummary ||
      isLoadingMovement ||
      isLoadingTrend ||
      isLoadingLowStock,
  };
};
