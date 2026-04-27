// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type { GetStockListRequest } from "@/services/StockService/types/StockRequest";
import type {
  GetStockListResponse,
  StockSummaryResponse,
} from "@/services/StockService/types/StockResponse";
import type { StockTransaction } from "@/types/stock/StockTransaction";

type GetMockTransactionListParams = GetStockListRequest;

type GetMockTransactionListResponse = {
  data: GetStockListResponse;
};

type GetMockStockSummaryResponse = {
  data: StockSummaryResponse;
};

const EMPTY_DATA: GetStockListResponse = {
  data: [],
  pagination: {
    total_page: 1,
    total_count: 0,
  },
};

const MOCK_TRANSACTION_LIST: StockTransaction[] = [
  {
    transaction_id: "tx1",
    product_id: "prod1",
    product_name: "Coca-Cola 325ml",
    type: "IN",
    quantity: 100,
    balance_after: 120,
    note: "Initial stock",
    created_at: "2026-04-14T09:00:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx2",
    product_id: "prod2",
    product_name: "Pepsi 325ml",
    type: "IN",
    quantity: 50,
    balance_after: 50,
    note: "Restock",
    created_at: "2026-04-15T10:30:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx3",
    product_id: "prod2",
    product_name: "Pepsi 325ml",
    type: "OUT",
    quantity: 32,
    balance_after: 18,
    note: "Sale order #1024",
    created_at: "2026-04-16T14:15:00Z",
    created_by_name: "staff1",
  },
  {
    transaction_id: "tx4",
    product_id: "prod4",
    product_name: "Fresh Milk 1L",
    type: "IN",
    quantity: 24,
    balance_after: 24,
    note: "Daily delivery",
    created_at: "2026-04-17T07:00:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx5",
    product_id: "prod4",
    product_name: "Fresh Milk 1L",
    type: "OUT",
    quantity: 16,
    balance_after: 8,
    note: "Sale orders",
    created_at: "2026-04-18T16:00:00Z",
    created_by_name: "staff2",
  },
  {
    transaction_id: "tx6",
    product_id: "prod11",
    product_name: "Greek Yogurt 150g",
    type: "ADJUST",
    quantity: -3,
    balance_after: 5,
    reason: "Damaged units",
    created_at: "2026-04-19T11:00:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx7",
    product_id: "prod3",
    product_name: "Lay's Original 50g",
    type: "IN",
    quantity: 75,
    balance_after: 75,
    note: "Restock",
    created_at: "2026-04-20T09:30:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx8",
    product_id: "prod5",
    product_name: "Whole Wheat Bread",
    type: "IN",
    quantity: 22,
    balance_after: 22,
    note: "Bakery delivery",
    created_at: "2026-04-21T06:00:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx9",
    product_id: "prod6",
    product_name: "Frozen Pizza Margherita",
    type: "IN",
    quantity: 40,
    balance_after: 40,
    note: "Restock",
    created_at: "2026-04-22T10:00:00Z",
    created_by_name: "staff1",
  },
  {
    transaction_id: "tx10",
    product_id: "prod7",
    product_name: "Banana 1kg",
    type: "OUT",
    quantity: 25,
    balance_after: 50,
    note: "Sale orders",
    created_at: "2026-04-23T13:30:00Z",
    created_by_name: "staff2",
  },
  {
    transaction_id: "tx11",
    product_id: "prod8",
    product_name: "Soy Sauce 200ml",
    type: "ADJUST",
    quantity: 2,
    balance_after: 60,
    reason: "Found missing units",
    created_at: "2026-04-24T15:00:00Z",
    created_by_name: "admin",
  },
  {
    transaction_id: "tx12",
    product_id: "prod9",
    product_name: "Sprite 325ml",
    type: "IN",
    quantity: 95,
    balance_after: 95,
    note: "New batch",
    created_at: "2026-04-25T08:30:00Z",
    created_by_name: "admin",
  },
];

// คำนวณ current_stock ของแต่ละ product จาก transactions
const computeCurrentStock = (productId: string): number => {
  const txs = MOCK_TRANSACTION_LIST.filter((t) => t.product_id === productId);
  if (txs.length === 0) return 0;
  // balance_after ของ transaction ล่าสุด (สุดท้ายตามเวลา) คือ current stock
  const sorted = [...txs].sort((a, b) =>
    a.created_at < b.created_at ? -1 : 1,
  );
  return sorted[sorted.length - 1].balance_after;
};

// min_stock dummy mapping (ปกติมากับ product master)
const MIN_STOCK_BY_PRODUCT: Record<string, number> = {
  prod1: 24,
  prod2: 24,
  prod3: 30,
  prod4: 12,
  prod5: 10,
  prod6: 15,
  prod7: 20,
  prod8: 18,
  prod9: 24,
  prod10: 20,
  prod11: 15,
  prod12: 12,
  prod13: 10,
  prod14: 15,
  prod15: 12,
};

export const useMockStockData = () => {
  const getMockTransactionList = async ({
    page,
    limit,
    criteria,
    sort_bys,
  }: GetMockTransactionListParams): Promise<GetMockTransactionListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    if (MOCK_TRANSACTION_LIST.length === 0) {
      return { data: EMPTY_DATA };
    }

    const search = criteria?.search?.toLowerCase().trim() ?? "";

    let filtered = MOCK_TRANSACTION_LIST.filter((t) => {
      if (criteria?.type && t.type !== criteria.type) return false;
      if (criteria?.product_id && t.product_id !== criteria.product_id)
        return false;
      if (search) {
        const inNote = t.note?.toLowerCase().includes(search) ?? false;
        const inProduct = t.product_name.toLowerCase().includes(search);
        if (!inNote && !inProduct) return false;
      }
      return true;
    });

    const sort = sort_bys?.[0];
    if (sort?.field && sort.direction) {
      const field = sort.field as keyof StockTransaction;
      const dir = sort.direction === "asc" ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av == null && bv == null) return 0;
        if (av == null) return -1 * dir;
        if (bv == null) return 1 * dir;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    const total = filtered.length;

    return {
      data: {
        data: paginated,
        pagination: {
          total_page: Math.ceil(total / limit) || 1,
          total_count: total,
        },
      },
    };
  };

  const getMockStockSummary = async (
    productId: string,
  ): Promise<GetMockStockSummaryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const currentStock = computeCurrentStock(productId);
    const minStock = MIN_STOCK_BY_PRODUCT[productId] ?? 0;
    return {
      data: {
        product_id: productId,
        current_stock: currentStock,
        min_stock: minStock,
        is_low_stock: currentStock < minStock,
      },
    };
  };

  return { getMockTransactionList, getMockStockSummary };
};
