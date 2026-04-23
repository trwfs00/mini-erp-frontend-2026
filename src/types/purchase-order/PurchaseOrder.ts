export type PurchaseOrderStatus = 'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';

export const PO_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  DRAFT: "ร่าง",
  CONFIRMED: "ยืนยันคำสั่งซื้อ",
  RECEIVED: "ได้รับของเข้าคลังแล้ว",
  CANCELLED: "ยกเลิก",
};

export type PurchaseOrderItem = {
  purchase_order_item_id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type PurchaseOrder = {
  purchase_order_id: string;
  supplier_id: string;
  supplier_name: string;
  status: PurchaseOrderStatus;
  total_amount: number;
  items: PurchaseOrderItem[];
  created_at: string;
  created_by: string;
  created_by_name: string;
};

export type PurchaseOrderSummary = {
  purchase_order_id: string;
  supplier_name: string;
  status: PurchaseOrderStatus;
  total_amount: number;
  item_count: number;
  created_at: string;
  created_by_name: string;
};
