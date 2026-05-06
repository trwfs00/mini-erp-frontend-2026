import type {
  DashboardSummary,
  LowStockProduct,
} from "@/types/dashboard/DashboardDetail";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";

export type GetDashboardSummaryResponse = DashboardSummary;
export type GetDashboardStockMovementResponse = StockMovementDailyPoint[];
export type GetDashboardPurchaseTrendResponse = PurchaseTrendPoint[];
export type GetDashboardLowStockResponse = LowStockProduct[];
