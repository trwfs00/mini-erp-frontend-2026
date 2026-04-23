import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

export interface GetPurchaseOrderListRequest {
  page: number;
  limit: number;
  criteria?: {
    search?: string;
    status?: PurchaseOrderStatus;
    supplier_id?: string;
  };
  sort_bys?: {
    field: string;
    direction: "asc" | "desc";
  }[];
}

export interface CreatePurchaseOrderItemRequest {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreatePurchaseOrderRequest {
  supplier_id: string;
  items: CreatePurchaseOrderItemRequest[];
}

export interface UpdatePurchaseOrderStatusRequest {
  status: PurchaseOrderStatus;
}
