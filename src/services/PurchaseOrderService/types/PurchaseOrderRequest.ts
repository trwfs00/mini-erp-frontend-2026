import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

export type GetPurchaseOrderListRequest = {
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
};

export type CreatePurchaseOrderItemRequest = {
  product_id: string;
  quantity: number;
  unit_price: number;
};

export type CreatePurchaseOrderRequest = {
  supplier_id: string;
  items: CreatePurchaseOrderItemRequest[];
};

export type UpdatePurchaseOrderStatusRequest = {
  status: PurchaseOrderStatus;
};
