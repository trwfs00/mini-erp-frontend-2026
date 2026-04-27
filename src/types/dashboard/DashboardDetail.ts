import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";

export type LowStockProduct = {
  product_id: string;
  sku: string;
  name: string;
  current_stock: number;
  min_stock: number;
  unit: string;
};

export type DashboardSummary = {
  total_products: number;
  total_stock_value: number;
  total_selling_value: number;
  low_stock_count: number;
  pending_po_count: number;
  received_po_this_month: number;
};

export type DashboardDetail = {
  summary: DashboardSummary;
  stock_movement: StockMovementDailyPoint[];
  purchase_trend: PurchaseTrendPoint[];
  low_stock_products: LowStockProduct[];
};
