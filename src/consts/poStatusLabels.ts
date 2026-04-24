import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";

export const PO_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
};
