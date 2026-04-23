import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $debugMode } from "@/stores/debugModeStore";
import type {
  GetPurchaseOrderListResponse,
  GetPurchaseOrderResponse,
  SavePurchaseOrderResponse,
} from "./types/PurchaseOrderResponse";
import type {
  GetPurchaseOrderListRequest,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderStatusRequest,
} from "./types/PurchaseOrderRequest";
import type { PurchaseOrder, PurchaseOrderSummary } from "@/types/purchase-order/PurchaseOrder";
import { StockService } from "../StockService";

const MOCK_POS: PurchaseOrder[] = [
  {
    purchase_order_id: "PO-2026-001",
    supplier_id: "SUP-001",
    supplier_name: "Global Foods Co., Ltd.",
    status: "RECEIVED",
    total_amount: 15000,
    created_at: "2026-04-20T10:00:00Z",
    created_by: "U001",
    created_by_name: "Admin User",
    items: [
      {
        purchase_order_item_id: "POI-001",
        purchase_order_id: "PO-2026-001",
        product_id: "P001",
        product_name: "Coca-Cola 325ml",
        quantity: 500,
        unit_price: 15,
        subtotal: 7500,
      },
      {
        purchase_order_item_id: "POI-002",
        purchase_order_id: "PO-2026-001",
        product_id: "P002",
        product_name: "Lay's Classic 50g",
        quantity: 250,
        unit_price: 30,
        subtotal: 7500,
      },
    ],
  },
  {
    purchase_order_id: "PO-2026-002",
    supplier_id: "SUP-002",
    supplier_name: "Best Beverages Inc.",
    status: "CONFIRMED",
    total_amount: 12000,
    created_at: "2026-04-22T14:30:00Z",
    created_by: "U001",
    created_by_name: "Admin User",
    items: [
      {
        purchase_order_item_id: "POI-003",
        purchase_order_id: "PO-2026-002",
        product_id: "P004",
        product_name: "Oishi Green Tea 500ml",
        quantity: 600,
        unit_price: 20,
        subtotal: 12000,
      },
    ],
  },
  {
    purchase_order_id: "PO-2026-003",
    supplier_id: "SUP-001",
    supplier_name: "Global Foods Co., Ltd.",
    status: "DRAFT",
    total_amount: 5000,
    created_at: "2026-04-23T09:00:00Z",
    created_by: "U002",
    created_by_name: "Staff Member",
    items: [
      {
        purchase_order_item_id: "POI-004",
        purchase_order_id: "PO-2026-003",
        product_id: "P003",
        product_name: "Singha Water 600ml",
        quantity: 500,
        unit_price: 10,
        subtotal: 5000,
      },
    ],
  },
];

export class PurchaseOrderService {
  static async getPurchaseOrderList(
    request: GetPurchaseOrderListRequest,
  ): Promise<ApiReturn<GetPurchaseOrderListResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[Mock] Fetching POs:", request);

          let filtered = [...MOCK_POS];
          if (request.criteria?.status) {
            filtered = filtered.filter((po) => po.status === request.criteria?.status);
          }
          if (request.criteria?.search) {
            const search = request.criteria.search.toLowerCase();
            filtered = filtered.filter(
              (po) =>
                po.purchase_order_id.toLowerCase().includes(search) ||
                po.supplier_name.toLowerCase().includes(search),
            );
          }

          const summaries: PurchaseOrderSummary[] = filtered.map((po) => ({
            purchase_order_id: po.purchase_order_id,
            supplier_name: po.supplier_name,
            status: po.status,
            total_amount: po.total_amount,
            item_count: po.items.length,
            created_at: po.created_at,
            created_by_name: po.created_by_name,
          }));

          const total = summaries.length;
          const { page, limit } = request;
          const start = (page - 1) * limit;
          const paginated = summaries.slice(start, start + limit);

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

    return AxiosUtil.createRequest<GetPurchaseOrderListResponse>({
      url: "/purchase-orders",
      method: "GET",
      params: request,
    });
  }

  static async getPurchaseOrder(
    id: string,
  ): Promise<ApiReturn<GetPurchaseOrderResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const po = MOCK_POS.find((p) => p.purchase_order_id === id);
          if (po) {
            resolve({ ok: true, data: po });
          } else {
            resolve({ ok: false, message: "Purchase Order not found" });
          }
        }, 300);
      });
    }

    return AxiosUtil.createRequest<GetPurchaseOrderResponse>({
      url: `/purchase-orders/${id}`,
      method: "GET",
    });
  }

  static async createPurchaseOrder(
    request: CreatePurchaseOrderRequest,
  ): Promise<ApiReturn<SavePurchaseOrderResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newId = `PO-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
          console.log("[Mock] Creating PO:", request);
          
          // In a real mock we would push to MOCK_POS, but since it's a static const, we'll just return success
          resolve({
            ok: true,
            data: { purchase_order_id: newId },
          });
        }, 800);
      });
    }

    return AxiosUtil.createRequest<SavePurchaseOrderResponse>({
      url: "/purchase-orders",
      method: "POST",
      data: request,
    });
  }

  static async updateStatus(
    id: string,
    status: UpdatePurchaseOrderStatusRequest["status"],
  ): Promise<ApiReturn<void>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise(async (resolve) => {
        setTimeout(async () => {
          const po = MOCK_POS.find((p) => p.purchase_order_id === id);
          if (po) {
            po.status = status;
            
            // Trigger Stock IN logic
            if (status === "RECEIVED") {
              console.log(`[Logic] PO ${id} RECEIVED. Triggering Stock IN for ${po.items.length} items.`);
              for (const item of po.items) {
                await StockService.stockIn({
                  product_id: item.product_id,
                  type: "IN",
                  quantity: item.quantity,
                  note: `Received from PO: ${id}`,
                });
              }
            }
            
            resolve({ ok: true, data: undefined });
          } else {
            resolve({ ok: false, message: "Purchase Order not found" });
          }
        }, 500);
      });
    }

    return AxiosUtil.createRequest<void>({
      url: `/purchase-orders/${id}/status`,
      method: "PATCH",
      data: { status },
    });
  }
}
