export const tReport = {
  // Common
  pageDescription: {
    th: "การวิเคราะห์และรายงานทางธุรกิจที่ส่งออกได้",
    en: "Analytics and exportable business reports.",
  },
  exportCsv: { th: "ส่งออก CSV", en: "Export CSV" },
  reportNotLoaded: { th: "ยังไม่ได้โหลดรายงาน", en: "Report not loaded" },
  unableGenerateFile: {
    th: "ไม่สามารถสร้างไฟล์ได้",
    en: "Unable to generate file.",
  },

  // Stock Summary
  stockSummary: {
    description: {
      th: "ภาพรวมสต็อกปัจจุบันพร้อมมูลค่าต้นทุนและราคาขาย",
      en: "Snapshot of current stock with cost and selling valuation.",
    },
    statTotalProducts: { th: "สินค้าทั้งหมด", en: "Total Products" },
    statCostValue: { th: "มูลค่าต้นทุน", en: "Cost Value" },
    statSellingValue: { th: "มูลค่าขาย", en: "Selling Value" },
    statLowStock: { th: "สต็อกต่ำ", en: "Low Stock" },
    items: { th: "รายการ", en: "items" },
    thead: {
      sku: { th: "SKU", en: "SKU" },
      name: { th: "ชื่อ", en: "Name" },
      current: { th: "คงเหลือ", en: "Current" },
      min: { th: "ขั้นต่ำ", en: "Min" },
      cost: { th: "ต้นทุน", en: "Cost" },
      sell: { th: "ขาย", en: "Sell" },
      costValue: { th: "มูลค่าต้นทุน", en: "Cost Value" },
      sellValue: { th: "มูลค่าขาย", en: "Sell Value" },
      status: { th: "สถานะ", en: "Status" },
      low: { th: "ต่ำ", en: "Low" },
      ok: { th: "ปกติ", en: "OK" },
    },
  },

  // Stock Movement
  stockMovement: {
    fromLabel: { th: "ตั้งแต่", en: "From" },
    toLabel: { th: "ถึง", en: "To" },
    statTotalIn: { th: "รับเข้าทั้งหมด", en: "Total IN" },
    statTotalOut: { th: "เบิกออกทั้งหมด", en: "Total OUT" },
    statAdjustments: { th: "ปรับยอด", en: "Adjustments" },
    dailyMovement: { th: "การเคลื่อนไหวรายวัน", en: "Daily Movement" },
    noTransactions: {
      th: "ไม่มีธุรกรรมในช่วงนี้",
      en: "No transactions in this range.",
    },
    thead: {
      date: { th: "วันที่", en: "Date" },
      product: { th: "สินค้า", en: "Product" },
      type: { th: "ประเภท", en: "Type" },
      qty: { th: "จำนวน", en: "Qty" },
      balance: { th: "คงเหลือ", en: "Balance" },
      by: { th: "โดย", en: "By" },
      note: { th: "หมายเหตุ", en: "Note" },
    },
  },

  // Purchase Summary
  purchaseSummary: {
    monthLabel: { th: "เดือน", en: "Month" },
    statOrders: { th: "ใบสั่งซื้อ", en: "Orders" },
    statAmount: { th: "ยอดรวม", en: "Amount" },
    thead: {
      poId: { th: "เลขที่ใบสั่งซื้อ", en: "PO ID" },
      supplier: { th: "ผู้จัดจำหน่าย", en: "Supplier" },
      status: { th: "สถานะ", en: "Status" },
      items: { th: "จำนวนรายการ", en: "Items" },
      total: { th: "ยอดรวม", en: "Total" },
      created: { th: "วันที่สร้าง", en: "Created" },
      by: { th: "โดย", en: "By" },
    },
  },
} as const;
