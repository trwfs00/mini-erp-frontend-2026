import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import type { Language } from "@/types/language/Language";
import { tPurchaseOrder } from "@/consts/translations/tPurchaseOrder";

export const PO_STATUS_LABELS: Record<
  PurchaseOrderStatus,
  Record<Language, string>
> = {
  DRAFT: tPurchaseOrder.status.DRAFT,
  CONFIRMED: tPurchaseOrder.status.CONFIRMED,
  RECEIVED: tPurchaseOrder.status.RECEIVED,
  CANCELLED: tPurchaseOrder.status.CANCELLED,
};
