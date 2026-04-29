import { useEffect, useState } from "react";
import { useMockDashboardData } from "./useMockDashboardData";
import type {
  DashboardSummary,
  LowStockProduct,
} from "@/types/dashboard/DashboardDetail";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";
import { NotificationUtil } from "@/utils/NotificationUtil";

export const useLoadInitialData = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [movement, setMovement] = useState<StockMovementDailyPoint[] | null>(
    null,
  );
  const [trend, setTrend] = useState<PurchaseTrendPoint[] | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[] | null>(null);

  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isReloadingSummary, setIsReloadingSummary] = useState(false);
  const [isReloadingMovement, setIsReloadingMovement] = useState(false);
  const [isReloadingTrend, setIsReloadingTrend] = useState(false);
  const [isReloadingLowStock, setIsReloadingLowStock] = useState(false);

  // TODO: เปลี่ยนเป็น DashboardService methods เมื่อ integrate API จริง
  const {
    getMockSummary,
    getMockStockMovement,
    getMockPurchaseTrend,
    getMockLowStock,
  } = useMockDashboardData();

  const callGetSummary = async (): Promise<boolean> => {
    const res = await getMockSummary();
    setSummary(res.data);
    return true;
  };

  const callGetMovement = async (): Promise<boolean> => {
    const res = await getMockStockMovement();
    setMovement(res.data);
    return true;
  };

  const callGetTrend = async (): Promise<boolean> => {
    const res = await getMockPurchaseTrend();
    setTrend(res.data);
    return true;
  };

  const callGetLowStock = async (): Promise<boolean> => {
    const res = await getMockLowStock();
    setLowStock(res.data);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const promises = [
      callGetSummary(),
      callGetMovement(),
      callGetTrend(),
      callGetLowStock(),
    ];
    const results = await Promise.all(promises);
    setIsLoadingInitialData(false);

    if (results.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadSummary = async (): Promise<boolean> => {
    setIsReloadingSummary(true);
    const success = await callGetSummary();
    setIsReloadingSummary(false);
    if (!success) {
      NotificationUtil.notifyError({ title: "Failed to load summary" });
    }
    return success;
  };

  const reloadMovement = async (): Promise<boolean> => {
    setIsReloadingMovement(true);
    const success = await callGetMovement();
    setIsReloadingMovement(false);
    if (!success) {
      NotificationUtil.notifyError({ title: "Failed to load stock movement" });
    }
    return success;
  };

  const reloadTrend = async (): Promise<boolean> => {
    setIsReloadingTrend(true);
    const success = await callGetTrend();
    setIsReloadingTrend(false);
    if (!success) {
      NotificationUtil.notifyError({ title: "Failed to load purchase trend" });
    }
    return success;
  };

  const reloadLowStock = async (): Promise<boolean> => {
    setIsReloadingLowStock(true);
    const success = await callGetLowStock();
    setIsReloadingLowStock(false);
    if (!success) {
      NotificationUtil.notifyError({ title: "Failed to load low stock list" });
    }
    return success;
  };

  const reloadAll = async (): Promise<void> => {
    await Promise.all([
      reloadSummary(),
      reloadMovement(),
      reloadTrend(),
      reloadLowStock(),
    ]);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    isLoadingInitialData,
    summary,
    movement,
    trend,
    lowStock,
    isReloadingSummary,
    isReloadingMovement,
    isReloadingTrend,
    isReloadingLowStock,
    reloadSummary,
    reloadMovement,
    reloadTrend,
    reloadLowStock,
    reloadAll,
  };
};
