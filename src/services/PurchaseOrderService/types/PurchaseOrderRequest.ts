import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

export type GetPurchaseOrderListRequest = {
  page: number;
  limit: number;
  criteria?: {
    search?: string;
    status?: PurchaseOrderStatus;
  };
  sort_bys?: {
    field: string;
    direction: "asc" | "desc";
  }[];
};

export type CreatePurchaseOrderItemRequest = {
  product_id: string;
  quantity: number;
  unit_price: number;
};

export type CreatePurchaseOrderRequest = {
  order_number: string;
  supplier_id: string;
  total_amount: number;
  items: CreatePurchaseOrderItemRequest[];
  created_by: string;
};

export type UpdatePurchaseOrderStatusRequest = {
  status: PurchaseOrderStatus;
  updated_by: string;
};
