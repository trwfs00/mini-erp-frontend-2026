import type { DashboardDetail } from "@/types/dashboard/DashboardDetail";
import { toIsoDate } from "@/utils/DateUtil";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";

export type GetMockDashboardResponse = {
  data: DashboardDetail;
};

export const EMPTY_DATA: GetMockDashboardResponse = {
  data: {
    summary: {
      total_products: 0,
      total_stock_value: 0,
      total_selling_value: 0,
      low_stock_count: 0,
      pending_po_count: 0,
      received_po_this_month: 0,
    },
    stock_movement: [],
    purchase_trend: [],
    low_stock_products: [],
  },
};

const generateMovementData = () => {
  const data = [];
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

const generateTrendData = () => {
  const data = [];
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

const MOCK_DASHBOARD_DATA: GetMockDashboardResponse = {
  data: {
    summary: {
      total_products: 124,
      total_stock_value: 1250000,
      total_selling_value: 1850000,
      low_stock_count: 12,
      pending_po_count: 5,
      received_po_this_month: 8,
    },
    stock_movement: generateMovementData(),
    purchase_trend: generateTrendData(),
    low_stock_products: [
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
    ],
  },
};

export const useMockDashboardData = () => {
  const getMockDashboardStats = async (): Promise<GetMockDashboardResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    if (!MOCK_DASHBOARD_DATA.data) {
      return EMPTY_DATA;
    }
    return MOCK_DASHBOARD_DATA;
  };

  return { getMockDashboardStats };
};
