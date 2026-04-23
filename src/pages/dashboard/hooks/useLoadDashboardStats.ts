import { useCallback, useEffect, useState } from "react";
import { DashboardService } from "@/services/DashboardService";
import type {
  DashboardStats,
  DashboardSummary,
  LowStockProduct,
} from "@/types/dashboard/DashboardStats";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";

const EMPTY_SUMMARY: DashboardSummary = {
  total_products: 0,
  total_stock_value: 0,
  total_selling_value: 0,
  low_stock_count: 0,
  pending_po_count: 0,
  received_po_this_month: 0,
};

const EMPTY_MOVEMENT: StockMovementDailyPoint[] = [];
const EMPTY_TREND: PurchaseTrendPoint[] = [];
const EMPTY_LOW_STOCK: LowStockProduct[] = [];

export const useLoadDashboardStats = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const response = await DashboardService.getDashboardStats();
    if (response.ok && response.data) {
      setDashboardStats(response.data);
    } else {
      console.error("Failed to load dashboard stats", response.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    summary: dashboardStats?.summary ?? EMPTY_SUMMARY,
    stockMovement: dashboardStats?.stock_movement ?? EMPTY_MOVEMENT,
    purchaseTrend: dashboardStats?.purchase_trend ?? EMPTY_TREND,
    lowStockProducts: dashboardStats?.low_stock_products ?? EMPTY_LOW_STOCK,
    isLoading,
    reloadDashboardStats: loadData,
  };
};
