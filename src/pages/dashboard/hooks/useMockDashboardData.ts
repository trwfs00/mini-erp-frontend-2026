// TODO: ลบไฟล์นี้เมื่อ integrate API จริง
import type {
  DashboardSummary,
  LowStockProduct,
} from "@/types/dashboard/DashboardDetail";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";
import { toIsoDate } from "@/utils/DateUtil";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";

const generateMovementData = (): StockMovementDailyPoint[] => {
  const data: StockMovementDailyPoint[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    data.push({
      date: toIsoDate(d.toISOString()),
      in: Math.floor(Math.random() * 50),
      out: Math.floor(Math.random() * 40),
      adjust: Math.floor(Math.random() * 5),
    });
  }
  return data;
};

const generateTrendData = (): PurchaseTrendPoint[] => {
  const data: PurchaseTrendPoint[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    data.push({
      month,
      total_amount: Math.floor(Math.random() * 100000) + 50000,
      order_count: Math.floor(Math.random() * 20) + 5,
    });
  }
  return data;
};

const MOCK_SUMMARY: DashboardSummary = {
  total_products: 124,
  total_stock_value: 1250000,
  total_selling_value: 1850000,
  low_stock_count: 12,
  pending_po_count: 5,
  received_po_this_month: 8,
};

const MOCK_LOW_STOCK: LowStockProduct[] = [
  {
    product_id: "p1",
    sku: "SKU001",
    name: "Premium Coffee Beans",
    current_stock: 5,
    min_stock: 20,
    unit: "kg",
  },
  {
    product_id: "p2",
    sku: "SKU012",
    name: "Organic Green Tea",
    current_stock: 2,
    min_stock: 15,
    unit: "box",
  },
  {
    product_id: "p3",
    sku: "SKU045",
    name: "Espresso Maker Filter",
    current_stock: 8,
    min_stock: 50,
    unit: "pcs",
  },
  {
    product_id: "p4",
    sku: "SKU088",
    name: "Sugar Syrup (Vanilla)",
    current_stock: 3,
    min_stock: 10,
    unit: "bottle",
  },
  {
    product_id: "p5",
    sku: "SKU102",
    name: "Paper Cups (12oz)",
    current_stock: 100,
    min_stock: 500,
    unit: "pcs",
  },
];

const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

export const useMockDashboardData = () => {
  const getMockSummary = async (): Promise<{ data: DashboardSummary }> => {
    await delay();
    return { data: MOCK_SUMMARY };
  };

  const getMockStockMovement = async (): Promise<{
    data: StockMovementDailyPoint[];
  }> => {
    await delay();
    return { data: generateMovementData() };
  };

  const getMockPurchaseTrend = async (): Promise<{
    data: PurchaseTrendPoint[];
  }> => {
    await delay();
    return { data: generateTrendData() };
  };

  const getMockLowStock = async (): Promise<{ data: LowStockProduct[] }> => {
    await delay();
    return { data: MOCK_LOW_STOCK };
  };

  return {
    getMockSummary,
    getMockStockMovement,
    getMockPurchaseTrend,
    getMockLowStock,
  };
};
