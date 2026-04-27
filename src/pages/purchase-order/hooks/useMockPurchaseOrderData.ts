// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type {
  GetPurchaseOrderListRequest,
  CreatePurchaseOrderRequest,
} from "@/services/PurchaseOrderService/types/PurchaseOrderRequest";
import type {
  GetPurchaseOrderListResponse,
  GetPurchaseOrderResponse,
  SavePurchaseOrderResponse,
} from "@/services/PurchaseOrderService/types/PurchaseOrderResponse";
import type {
  PurchaseOrder,
  PurchaseOrderSummary,
} from "@/types/purchase-order/PurchaseOrder";

type GetMockPurchaseOrderListParams = GetPurchaseOrderListRequest;

type GetMockPurchaseOrderListResponse = {
  data: GetPurchaseOrderListResponse;
};

type GetMockPurchaseOrderResponse = {
  data: GetPurchaseOrderResponse;
};

type CreateMockPurchaseOrderResponse = {
  data: SavePurchaseOrderResponse;
};

const EMPTY_DATA: GetPurchaseOrderListResponse = {
  data: [],
  pagination: {
    total_page: 1,
    total_count: 0,
  },
};

const MOCK_PO_DETAILS: PurchaseOrder[] = [
  {
    purchase_order_id: "PO-2024-0001",
    supplier_id: "sup1",
    supplier_name: "Bangkok Beverages Co., Ltd.",
    status: "RECEIVED",
    total_amount: 4500,
    items: [
      {
        purchase_order_item_id: "poi1",
        purchase_order_id: "PO-2024-0001",
        product_id: "prod1",
        product_name: "Coca-Cola 325ml",
        quantity: 100,
        unit_price: 8,
        subtotal: 800,
      },
      {
        purchase_order_item_id: "poi2",
        purchase_order_id: "PO-2024-0001",
        product_id: "prod2",
        product_name: "Pepsi 325ml",
        quantity: 100,
        unit_price: 8,
        subtotal: 800,
      },
    ],
    created_at: "2026-04-02T09:00:00Z",
    created_by: "user1",
    created_by_name: "Admin",
  },
  {
    purchase_order_id: "PO-2024-0002",
    supplier_id: "sup3",
    supplier_name: "Fresh Dairy Supply",
    status: "CONFIRMED",
    total_amount: 1680,
    items: [
      {
        purchase_order_item_id: "poi3",
        purchase_order_id: "PO-2024-0002",
        product_id: "prod4",
        product_name: "Fresh Milk 1L",
        quantity: 48,
        unit_price: 35,
        subtotal: 1680,
      },
    ],
    created_at: "2026-04-06T10:30:00Z",
    created_by: "user1",
    created_by_name: "Admin",
  },
  {
    purchase_order_id: "PO-2024-0003",
    supplier_id: "sup2",
    supplier_name: "Thai Snack Distributors",
    status: "DRAFT",
    total_amount: 2700,
    items: [
      {
        purchase_order_item_id: "poi4",
        purchase_order_id: "PO-2024-0003",
        product_id: "prod3",
        product_name: "Lay's Original 50g",
        quantity: 100,
        unit_price: 12,
        subtotal: 1200,
      },
      {
        purchase_order_item_id: "poi5",
        purchase_order_id: "PO-2024-0003",
        product_id: "prod10",
        product_name: "Pringles Sour Cream 110g",
        quantity: 50,
        unit_price: 30,
        subtotal: 1500,
      },
    ],
    created_at: "2026-04-09T14:00:00Z",
    created_by: "user2",
    created_by_name: "Staff One",
  },
  {
    purchase_order_id: "PO-2024-0004",
    supplier_id: "sup4",
    supplier_name: "Golden Bakery Wholesale",
    status: "CANCELLED",
    total_amount: 750,
    items: [
      {
        purchase_order_item_id: "poi6",
        purchase_order_id: "PO-2024-0004",
        product_id: "prod5",
        product_name: "Whole Wheat Bread",
        quantity: 30,
        unit_price: 25,
        subtotal: 750,
      },
    ],
    created_at: "2026-04-11T08:00:00Z",
    created_by: "user1",
    created_by_name: "Admin",
  },
  {
    purchase_order_id: "PO-2024-0005",
    supplier_id: "sup5",
    supplier_name: "Frozen Foods Asia",
    status: "RECEIVED",
    total_amount: 8000,
    items: [
      {
        purchase_order_item_id: "poi7",
        purchase_order_id: "PO-2024-0005",
        product_id: "prod6",
        product_name: "Frozen Pizza Margherita",
        quantity: 100,
        unit_price: 80,
        subtotal: 8000,
      },
    ],
    created_at: "2026-04-15T15:30:00Z",
    created_by: "user1",
    created_by_name: "Admin",
  },
  {
    purchase_order_id: "PO-2024-0006",
    supplier_id: "sup6",
    supplier_name: "Country Produce Cooperative",
    status: "DRAFT",
    total_amount: 1200,
    items: [
      {
        purchase_order_item_id: "poi8",
        purchase_order_id: "PO-2024-0006",
        product_id: "prod7",
        product_name: "Banana 1kg",
        quantity: 60,
        unit_price: 20,
        subtotal: 1200,
      },
    ],
    created_at: "2026-04-19T09:00:00Z",
    created_by: "user2",
    created_by_name: "Staff One",
  },
  {
    purchase_order_id: "PO-2024-0007",
    supplier_id: "sup7",
    supplier_name: "Premium Condiments Trading",
    status: "CONFIRMED",
    total_amount: 540,
    items: [
      {
        purchase_order_item_id: "poi9",
        purchase_order_id: "PO-2024-0007",
        product_id: "prod8",
        product_name: "Soy Sauce 200ml",
        quantity: 30,
        unit_price: 18,
        subtotal: 540,
      },
    ],
    created_at: "2026-04-23T11:30:00Z",
    created_by: "user1",
    created_by_name: "Admin",
  },
];

const toSummary = (po: PurchaseOrder): PurchaseOrderSummary => ({
  purchase_order_id: po.purchase_order_id,
  supplier_name: po.supplier_name,
  status: po.status,
  total_amount: po.total_amount,
  item_count: po.items.length,
  created_at: po.created_at,
  created_by_name: po.created_by_name,
});

export const useMockPurchaseOrderData = () => {
  const getMockPurchaseOrderList = async ({
    page,
    limit,
    criteria,
    sort_bys,
  }: GetMockPurchaseOrderListParams): Promise<GetMockPurchaseOrderListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    if (MOCK_PO_DETAILS.length === 0) {
      return { data: EMPTY_DATA };
    }

    const search = criteria?.search?.toLowerCase().trim() ?? "";

    let filtered = MOCK_PO_DETAILS.filter((po) => {
      if (criteria?.status && po.status !== criteria.status) return false;
      if (search) {
        const inId = po.purchase_order_id.toLowerCase().includes(search);
        const inSupplier = po.supplier_name.toLowerCase().includes(search);
        if (!inId && !inSupplier) return false;
      }
      return true;
    });

    const sort = sort_bys?.[0];
    if (sort?.field && sort.direction) {
      const field = sort.field as keyof PurchaseOrderSummary;
      const dir = sort.direction === "asc" ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        const av = toSummary(a)[field];
        const bv = toSummary(b)[field];
        if (av == null && bv == null) return 0;
        if (av == null) return -1 * dir;
        if (bv == null) return 1 * dir;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit).map(toSummary);
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

  const getMockPurchaseOrder = async (
    id: string,
  ): Promise<GetMockPurchaseOrderResponse | null> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const found = MOCK_PO_DETAILS.find((po) => po.purchase_order_id === id);
    if (!found) return null;
    return { data: found };
  };

  const createMockPurchaseOrder = async (
    _request: CreatePurchaseOrderRequest,
  ): Promise<CreateMockPurchaseOrderResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const newId = `PO-2024-${String(MOCK_PO_DETAILS.length + 1).padStart(4, "0")}`;
    return { data: { purchase_order_id: newId } };
  };

  return {
    getMockPurchaseOrderList,
    getMockPurchaseOrder,
    createMockPurchaseOrder,
  };
};
