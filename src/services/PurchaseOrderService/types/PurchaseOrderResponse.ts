import type { Pagination } from "@/types/api/Pagination";
import type { PurchaseOrder, PurchaseOrderSummary } from "@/types/purchase-order/PurchaseOrder";

export type GetPurchaseOrderListResponse = {
  data: PurchaseOrderSummary[];
  pagination: Pagination;
};

export type GetPurchaseOrderResponse = PurchaseOrder;

export type SavePurchaseOrderResponse = {
  purchase_order_id: string;
};
