export const tDashboard = {
  title: { th: "แดชบอร์ด", en: "Dashboard" },
  description: {
    th: "ภาพรวมของธุรกิจของคุณ",
    en: "Overview of your business at a glance.",
  },

  summary: {
    totalProducts: { th: "สินค้าทั้งหมด", en: "Total Products" },
    stockValueCost: { th: "มูลค่าสต็อก (ทุน)", en: "Stock Value (Cost)" },
    stockValueSelling: { th: "มูลค่าสต็อก (ขาย)", en: "Stock Value (Selling)" },
    lowStock: { th: "สต็อกต่ำ", en: "Low Stock" },
    pendingPOs: { th: "ใบสั่งซื้อค้าง", en: "Pending POs" },
    receivedThisMonth: { th: "รับเข้าเดือนนี้", en: "Received This Month" },
  },

  stockMovementChart: {
    title: { th: "การเคลื่อนไหวสต็อก", en: "Stock Movement" },
    subtitle: { th: "14 วันล่าสุด · เข้า / ออก / ปรับยอด", en: "Last 14 days · IN / OUT / ADJUST" },
    empty: { th: "ไม่มีการเคลื่อนไหวในช่วงนี้", en: "No movement in this period." },
    seriesIn: { th: "เข้า", en: "In" },
    seriesOut: { th: "ออก", en: "Out" },
    seriesAdjust: { th: "ปรับยอด", en: "Adjust" },
  },
  purchaseTrendChart: {
    title: { th: "แนวโน้มการสั่งซื้อ", en: "Purchase Trend" },
    subtitle: { th: "ยอดสั่งซื้อรายเดือน", en: "Monthly purchase totals" },
    empty: { th: "ไม่มีข้อมูลการสั่งซื้อ", en: "No purchase data available." },
    seriesAmount: { th: "ยอดรวม", en: "Amount" },
  },
  lowStockList: {
    title: { th: "เตือนสต็อกต่ำ", en: "Low Stock Warnings" },
    subtitle: { th: "สินค้าที่ต่ำกว่าขั้นต่ำ", en: "Products below minimum threshold" },
    empty: {
      th: "ไม่มีสินค้าที่สต็อกต่ำ",
      en: "No products are running low.",
    },
    minStock: { th: "ขั้นต่ำ", en: "Min" },
    units: { th: "ชิ้น", en: "units" },
  },
} as const;
