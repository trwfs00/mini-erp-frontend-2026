export const tPurchaseOrder = {
  title: { th: "ใบสั่งซื้อ", en: "Purchase Orders" },
  purchaseOrder: { th: "ใบสั่งซื้อ", en: "purchase order" },

  thead: {
    poNumber: { th: "เลขที่ใบสั่งซื้อ", en: "PO Number" },
    supplier: { th: "ผู้จัดจำหน่าย", en: "Supplier" },
    status: { th: "สถานะ", en: "Status" },
    totalAmount: { th: "ยอดรวม", en: "Total Amount" },
    items: { th: "จำนวนรายการ", en: "Items" },
    created: { th: "วันที่สร้าง", en: "Created Date" },
    createdBy: { th: "ผู้สร้าง", en: "Created By" },
    actions: { th: "จัดการ", en: "Actions" },
    product: { th: "สินค้า", en: "Product" },
    quantity: { th: "จำนวน", en: "Quantity" },
    unitPrice: { th: "ราคาต่อหน่วย", en: "Unit Price" },
    subtotal: { th: "รวม", en: "Subtotal" },
  },

  // Filters
  searchPlaceholder: {
    th: "ค้นหาเลขที่หรือผู้จัดจำหน่าย...",
    en: "Search by ID or Supplier...",
  },
  statusPlaceholder: { th: "สถานะ", en: "Status" },
  status: {
    all: { th: "ทุกสถานะ", en: "All Status" },
    DRAFT: { th: "ฉบับร่าง", en: "Draft" },
    CONFIRMED: { th: "ยืนยันแล้ว", en: "Confirmed" },
    RECEIVED: { th: "รับสินค้าแล้ว", en: "Received" },
    CANCELLED: { th: "ยกเลิก", en: "Cancelled" },
  },

  // Buttons
  createButton: { th: "สร้างใบสั่งซื้อ", en: "Create PO" },

  description: {
    th: "สร้างและติดตามใบสั่งซื้อสินค้าคงคลังของคุณ",
    en: "Create and track your inventory purchase orders.",
  },

  // Create page
  create: {
    title: { th: "สร้างใบสั่งซื้อ", en: "Create Purchase Order" },
    description: {
      th: "กรอกรายละเอียดเพื่อสร้างใบสั่งซื้อใหม่",
      en: "Fill in the details to create a new purchase order.",
    },
    save: { th: "บันทึกใบสั่งซื้อ", en: "Save Purchase Order" },
    orderNumberLabel: { th: "เลขที่ใบสั่งซื้อ", en: "Order Number" },
    orderNumberPlaceholder: { th: "เช่น PO-2026-001", en: "e.g. PO-2026-001" },
    supplierLabel: { th: "ผู้จัดจำหน่าย", en: "Supplier" },
    supplierPlaceholder: { th: "เลือกผู้จัดจำหน่าย", en: "Choose supplier" },
    productPlaceholder: { th: "เลือกสินค้า", en: "Select Product" },
    addItem: { th: "เพิ่มรายการ", en: "Add Item" },
    totalAmount: { th: "ยอดรวมทั้งสิ้น", en: "Total Amount" },
    notifyCreateSuccess: {
      th: "สร้างใบสั่งซื้อสำเร็จ",
      en: "Purchase Order created successfully",
    },
    notifyCreateError: {
      th: "สร้างใบสั่งซื้อไม่สำเร็จ",
      en: "Failed to create purchase order",
    },
  },

  // Detail page
  detail: {
    createdOnBy: (date: string, name: string) => ({
      th: `สร้างเมื่อ ${date} โดย ${name}`,
      en: `Created on ${date} by ${name}`,
    }),
    cancelButton: { th: "ยกเลิกใบสั่งซื้อ", en: "Cancel PO" },
    confirmButton: { th: "ยืนยันคำสั่งซื้อ", en: "Confirm Order" },
    receiveButton: { th: "รับสินค้า", en: "Receive Stock" },
    supplierInfo: { th: "ข้อมูลผู้จัดจำหน่าย", en: "Supplier Information" },
    name: { th: "ชื่อ", en: "Name" },
    id: { th: "รหัส", en: "ID" },
    timeline: { th: "ลำดับเหตุการณ์", en: "Order Timeline" },
    timelineCreated: { th: "สร้างแล้ว", en: "Created" },
    timelineConfirmed: { th: "ยืนยันแล้ว", en: "Confirmed" },
    timelineAwaiting: { th: "รอการส่งมอบ", en: "Awaiting delivery" },
    timelineReceived: { th: "รับสินค้าแล้ว", en: "Received" },
    timelineStockUpdated: { th: "อัปเดตสต็อกแล้ว", en: "Stock updated" },
    confirmStatusTitle: (status: string) => ({
      th: `ยืนยันการเปลี่ยนสถานะ: ${status}`,
      en: `Confirm Status Change: ${status}`,
    }),
    confirmStatusMessage: (status: string) => ({
      th: `คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะเป็น ${status}?`,
      en: `Are you sure you want to change status to ${status}?`,
    }),
    receivedWarning: {
      th: "การกระทำนี้จะเพิ่มสต็อกของสินค้าทุกรายการในใบสั่งซื้อนี้โดยอัตโนมัติ",
      en: "This will automatically increase stock levels for all items in this order.",
    },
    notifyUpdateError: {
      th: "อัปเดตสถานะไม่สำเร็จ",
      en: "Failed to update status",
    },
  },
} as const;
