import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

export type PurchaseSummaryRow = {
  purchase_order_id: string;
  supplier_name: string;
  status: PurchaseOrderStatus;
  item_count: number;
  total_amount: number;
  created_at: string;
  created_by_name: string;
};

export type PurchaseTrendPoint = {
  month: string;
  total_amount: number;
  order_count: number;
};

export type PurchaseSummaryReport = {
  month: string;
  rows: PurchaseSummaryRow[];
  totals: {
    total_orders: number;
    total_amount: number;
    by_status: Record<PurchaseOrderStatus, number>;
  };
};
