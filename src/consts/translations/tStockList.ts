export const tStockList = {
  title: { th: "การเคลื่อนไหวสต็อก", en: "Stock Transactions" },
  transaction: { th: "ธุรกรรม", en: "transaction" },

  thead: {
    date: { th: "วันที่", en: "Date" },
    product: { th: "สินค้า", en: "Product" },
    type: { th: "ประเภท", en: "Type" },
    quantity: { th: "จำนวน", en: "Quantity" },
    balance: { th: "คงเหลือ", en: "Balance" },
    by: { th: "โดย", en: "By" },
    note: { th: "หมายเหตุ/เหตุผล", en: "Note/Reason" },
  },

  // filters
  searchLabel: { th: "ค้นหา", en: "Search" },
  searchPlaceholder: {
    th: "ค้นหาหมายเหตุหรือสินค้า...",
    en: "Search note or product...",
  },
  typeLabel: { th: "ประเภท", en: "Type" },
  typeAllPlaceholder: { th: "ประเภททั้งหมด", en: "All Types" },
  productLabel: { th: "สินค้า", en: "Product" },
  productAllPlaceholder: { th: "สินค้าทั้งหมด", en: "All Products" },

  typeOptions: {
    in: { th: "รับเข้า", en: "Stock IN" },
    out: { th: "เบิกออก", en: "Stock OUT" },
    adjust: { th: "ปรับยอด", en: "Stock ADJUST" },
  },

  // Badge labels (สั้นกว่า typeOptions ใช้ในตาราง/badge)
  typeBadge: {
    IN: { th: "รับเข้า", en: "IN" },
    OUT: { th: "เบิกออก", en: "OUT" },
    ADJUST: { th: "ปรับยอด", en: "ADJUST" },
  },

  // summary alert
  summary: {
    title: { th: "สรุปสต็อก", en: "Stock Summary" },
    currentBalance: { th: "ยอดคงเหลือ", en: "CURRENT BALANCE" },
    minimumRequired: { th: "ขั้นต่ำที่ต้องมี", en: "MINIMUM REQUIRED" },
    lowStockWarning: { th: "เตือนสต็อกต่ำ", en: "LOW STOCK WARNING" },
  },

  // form drawer
  form: {
    title: { th: "บันทึกธุรกรรมสต็อก", en: "Create Stock Transaction" },
    addNew: { th: "เพิ่มธุรกรรม", en: "New Transaction" },
    productLabel: { th: "สินค้า", en: "Product" },
    productPlaceholder: { th: "เลือกสินค้า", en: "Select product" },
    inventoryStatus: { th: "สถานะคลังสินค้า", en: "Inventory Status" },
    currentStock: { th: "สต็อกปัจจุบัน", en: "Current Stock" },
    lowStockAlert: { th: " (สต็อกต่ำ!)", en: " (Low Stock Alert!)" },
    typeLabel: { th: "ประเภทธุรกรรม", en: "Transaction Type" },
    typeIn: { th: "รับเข้า (Stock IN)", en: "Stock IN (Receive)" },
    typeOut: { th: "เบิกออก (Stock OUT)", en: "Stock OUT (Release)" },
    typeAdjust: { th: "ปรับยอด (Stock ADJUST)", en: "Stock ADJUST (Correction)" },
    quantityLabel: { th: "จำนวน", en: "Quantity" },
    quantityPlaceholder: { th: "ระบุจำนวน", en: "Enter quantity" },
    quantityAdjustPlaceholder: {
      th: "ใส่ค่าติดลบเพื่อลดสต็อก",
      en: "Use negative for stock decrease",
    },
    reasonLabel: { th: "เหตุผลในการปรับปรุง", en: "Reason for Adjustment" },
    reasonPlaceholder: {
      th: "เช่น สินค้าชำรุด, ปรับปรุงยอดสต็อก",
      en: "e.g. Damaged goods, Stock count correction",
    },
    noteLabel: { th: "หมายเหตุ (ไม่บังคับ)", en: "Note (Optional)" },
    notePlaceholder: { th: "ใส่รายละเอียดเพิ่มเติม...", en: "Add extra details..." },
    submit: { th: "บันทึกธุรกรรม", en: "Submit Transaction" },
    insufficientStock: (current: number) => ({
      th: `สต็อกไม่พอ ยอดคงเหลือคือ ${current}`,
      en: `Insufficient stock. Current balance is ${current}`,
    }),
  },

  description: {
    th: "จัดการระดับสินค้าคงคลังและติดตามทุกการเคลื่อนไหว",
    en: "Manage inventory levels and track every movement.",
  },
} as const;
