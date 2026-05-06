import type {
  DashboardSummary,
  LowStockProduct,
} from "@/types/dashboard/DashboardDetail";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";

export type GetDashboardSummaryResponse = DashboardSummary;

export type GetDashboardStockMovementResponse = {
  stock_movements: StockMovementDailyPoint[];
};

export type GetDashboardPurchaseTrendResponse = {
  trends: PurchaseTrendPoint[];
};

export type GetDashboardLowStockResponse = {
  items: LowStockProduct[];
};
