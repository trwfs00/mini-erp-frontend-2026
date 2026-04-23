import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $debugMode } from "@/stores/debugModeStore";
import type {
  GetStockListResponse,
  StockSummaryResponse,
} from "./types/StockResponse";
import type {
  GetStockListRequest,
  CreateStockTransactionRequest,
} from "./types/StockRequest";
import type { StockTransaction } from "@/types/stock/StockTransaction";

const MOCK_TRANSACTIONS: StockTransaction[] = [
  {
    transaction_id: "TX-001",
    product_id: "P001",
    product_name: "Coca-Cola 325ml",
    type: "IN",
    quantity: 100,
    balance_after: 100,
    note: "Initial stock import",
    created_at: "2026-04-20T09:00:00Z",
    created_by_name: "Admin User",
  },
  {
    transaction_id: "TX-002",
    product_id: "P001",
    product_name: "Coca-Cola 325ml",
    type: "OUT",
    quantity: 10,
    balance_after: 90,
    note: "Daily sales",
    created_at: "2026-04-21T10:00:00Z",
    created_by_name: "Staff Member",
  },
  {
    transaction_id: "TX-003",
    product_id: "P002",
    product_name: "Lay's Classic 50g",
    type: "IN",
    quantity: 50,
    balance_after: 50,
    note: "Restock from supplier",
    created_at: "2026-04-22T11:00:00Z",
    created_by_name: "Admin User",
  },
  {
    transaction_id: "TX-015",
    product_id: "P004",
    product_name: "Oishi Green Tea 500ml",
    type: "ADJUST",
    quantity: 110,
    balance_after: 110,
    reason: "Monthly inventory count adjustment",
    created_at: "2026-04-23T16:00:00Z",
    created_by_name: "Warehouse Manager",
  },
  {
    transaction_id: "TX-014",
    product_id: "P003",
    product_name: "Singha Water 600ml",
    type: "OUT",
    quantity: 100,
    balance_after: 50,
    note: "Bulk order for Event X",
    created_at: "2026-04-23T15:30:00Z",
    created_by_name: "Warehouse Staff",
  },
  {
    transaction_id: "TX-013",
    product_id: "P005",
    product_name: "MAMA Instant Noodles",
    type: "OUT",
    quantity: 100,
    balance_after: 400,
    note: "Export to Branch B",
    created_at: "2026-04-23T14:45:00Z",
    created_by_name: "Staff Member",
  },
  {
    transaction_id: "TX-012",
    product_id: "P002",
    product_name: "Lay's Classic 50g",
    type: "IN",
    quantity: 30,
    balance_after: 75,
    created_at: "2026-04-23T14:00:00Z",
    created_by_name: "Warehouse Staff",
  },
  {
    transaction_id: "TX-011",
    product_id: "P004",
    product_name: "Oishi Green Tea 500ml",
    type: "OUT",
    quantity: 20,
    created_at: "2026-04-23T13:15:00Z",
    created_by_name: "Staff Member",
    balance_after: 100,
  },
  {
    transaction_id: "TX-010",
    product_id: "P001",
    product_name: "Coca-Cola 325ml",
    type: "ADJUST",
    quantity: 70,
    balance_after: 70,
    reason: "Damaged stock removal",
    created_at: "2026-04-23T12:30:00Z",
    created_by_name: "Warehouse Manager",
  },
  {
    transaction_id: "TX-009",
    product_id: "P005",
    product_name: "MAMA Instant Noodles",
    type: "IN",
    quantity: 500,
    balance_after: 500,
    note: "Supplier delivery",
    created_at: "2026-04-23T11:45:00Z",
    created_by_name: "Admin User",
  },
  {
    transaction_id: "TX-008",
    product_id: "P003",
    product_name: "Singha Water 600ml",
    type: "OUT",
    quantity: 50,
    balance_after: 150,
    created_at: "2026-04-23T11:00:00Z",
    created_by_name: "Warehouse Staff",
  },
  {
    transaction_id: "TX-007",
    product_id: "P004",
    product_name: "Oishi Green Tea 500ml",
    type: "IN",
    quantity: 120,
    balance_after: 120,
    created_at: "2026-04-23T10:30:00Z",
    created_by_name: "Admin User",
  },
  {
    transaction_id: "TX-006",
    product_id: "P002",
    product_name: "Lay's Classic 50g",
    type: "OUT",
    quantity: 5,
    balance_after: 45,
    created_at: "2026-04-23T10:00:00Z",
    created_by_name: "Staff Member",
  },
  {
    transaction_id: "TX-005",
    product_id: "P001",
    product_name: "Coca-Cola 325ml",
    type: "OUT",
    quantity: 25,
    balance_after: 65,
    created_at: "2026-04-23T09:15:00Z",
    created_by_name: "Staff Member",
  },
  {
    transaction_id: "TX-004",
    product_id: "P003",
    product_name: "Singha Water 600ml",
    type: "IN",
    quantity: 200,
    balance_after: 200,
    note: "Restock",
    created_at: "2026-04-23T08:30:00Z",
    created_by_name: "Warehouse Manager",
  },
];

export class StockService {
  static async getTransactionList(
    request: GetStockListRequest,
  ): Promise<ApiReturn<GetStockListResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[Mock] Fetching stock transactions:", request);

          let filtered = [...MOCK_TRANSACTIONS];

          if (request.criteria?.product_id) {
            filtered = filtered.filter(
              (t) => t.product_id === request.criteria.product_id,
            );
          }

          if (request.criteria?.type) {
            filtered = filtered.filter(
              (t) => t.type === request.criteria.type,
            );
          }

          // Sorting logic
          if (request.sort_bys && request.sort_bys.length > 0) {
            const { field, direction } = request.sort_bys[0];
            filtered.sort((a, b) => {
              const valA = a[field as keyof StockTransaction];
              const valB = b[field as keyof StockTransaction];
              if (valA === undefined || valB === undefined) return 0;
              if (valA < valB) return direction === "asc" ? -1 : 1;
              if (valA > valB) return direction === "asc" ? 1 : -1;
              return 0;
            });
          }

          const total = filtered.length;
          const { page, limit } = request;
          const start = (page - 1) * limit;
          const paginated = filtered.slice(start, start + limit);

          resolve({
            ok: true,
            data: {
              data: paginated,
              pagination: {
                total_page: Math.ceil(total / limit),
                total_count: total,
              },
            },
          });
        }, 500);
      });
    }

    return AxiosUtil.createRequest<GetStockListResponse>({
      url: "/stock/list",
      method: "GET",
      params: request,
    });
  }

  static async stockIn(
    data: CreateStockTransactionRequest,
  ): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: "/stock/in",
      method: "POST",
      data,
    });
  }

  static async stockOut(
    data: CreateStockTransactionRequest,
  ): Promise<ApiReturn<void>> {
    // For mock/local validation if needed, but usually handled by backend
    return AxiosUtil.createRequest<void>({
      url: "/stock/out",
      method: "POST",
      data,
    });
  }

  static async stockAdjust(
    data: CreateStockTransactionRequest,
  ): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: "/stock/adjust",
      method: "POST",
      data,
    });
  }

  static async getStockSummary(
    productId: string,
  ): Promise<ApiReturn<StockSummaryResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock calculation
          const productTransactions = MOCK_TRANSACTIONS.filter(
            (t) => t.product_id === productId,
          );
          
          let currentStock = 0;
          productTransactions.forEach((t) => {
            if (t.type === "IN") currentStock += t.quantity;
            else if (t.type === "OUT") currentStock -= t.quantity;
            else if (t.type === "ADJUST") currentStock = t.quantity; // Adjust often sets absolute or delta, let's assume delta for simplicity or absolute based on implementation
          });

          resolve({
            ok: true,
            data: {
              product_id: productId,
              current_stock: currentStock,
              min_stock: 10,
              is_low_stock: currentStock < 10,
            },
          });
        }, 300);
      });
    }

    return AxiosUtil.createRequest<StockSummaryResponse>({
      url: `/products/${productId}/stock-summary`,
      method: "GET",
    });
  }
}
