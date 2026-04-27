// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import type { ProductList } from "@/types/product/ProductList";
import type { GetProductListRequest } from "@/services/ProductService/types/ProductRequest";
import type { GetProductListResponse } from "@/services/ProductService/types/ProductResponse";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";

type GetMockProductListParams = GetProductListRequest;

type GetMockProductListResponse = {
  data: GetProductListResponse;
};

const EMPTY_DATA: GetProductListResponse = {
  data: [],
  pagination: {
    total_page: 1,
    total_count: 0,
  },
};

const MOCK_PRODUCT_LIST: ProductList[] = [
  {
    product_id: "prod1",
    sku: "BVG-001",
    name: "Coca-Cola 325ml",
    category_id: "cat1",
    cost_price: 8,
    selling_price: 15,
    unit: "can",
    min_stock: 24,
    current_stock: 120,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    product_id: "prod2",
    sku: "BVG-002",
    name: "Pepsi 325ml",
    category_id: "cat1",
    cost_price: 8,
    selling_price: 15,
    unit: "can",
    min_stock: 24,
    current_stock: 18,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    product_id: "prod3",
    sku: "SNK-001",
    name: "Lay's Original 50g",
    category_id: "cat3",
    cost_price: 12,
    selling_price: 20,
    unit: "bag",
    min_stock: 30,
    current_stock: 75,
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
  },
  {
    product_id: "prod4",
    sku: "DRY-001",
    name: "Fresh Milk 1L",
    category_id: "cat4",
    cost_price: 35,
    selling_price: 55,
    unit: "bottle",
    min_stock: 12,
    current_stock: 8,
    created_at: "2024-01-17T09:00:00Z",
    updated_at: "2024-01-22T16:45:00Z",
  },
  {
    product_id: "prod5",
    sku: "BKR-001",
    name: "Whole Wheat Bread",
    category_id: "cat5",
    cost_price: 25,
    selling_price: 45,
    unit: "loaf",
    min_stock: 10,
    current_stock: 22,
    created_at: "2024-01-18T12:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
  },
  {
    product_id: "prod6",
    sku: "FRZ-001",
    name: "Frozen Pizza Margherita",
    category_id: "cat6",
    cost_price: 80,
    selling_price: 149,
    unit: "box",
    min_stock: 15,
    current_stock: 40,
    created_at: "2024-01-19T13:00:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
  {
    product_id: "prod7",
    sku: "PRD-001",
    name: "Banana 1kg",
    category_id: "cat7",
    cost_price: 20,
    selling_price: 35,
    unit: "kg",
    min_stock: 20,
    current_stock: 50,
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z",
  },
  {
    product_id: "prod8",
    sku: "CDM-001",
    name: "Soy Sauce 200ml",
    category_id: "cat8",
    cost_price: 18,
    selling_price: 30,
    unit: "bottle",
    min_stock: 18,
    current_stock: 60,
    created_at: "2024-01-21T15:00:00Z",
    updated_at: "2024-01-28T11:30:00Z",
  },
  {
    product_id: "prod9",
    sku: "BVG-003",
    name: "Sprite 325ml",
    category_id: "cat1",
    cost_price: 8,
    selling_price: 15,
    unit: "can",
    min_stock: 24,
    current_stock: 95,
    created_at: "2024-01-22T10:00:00Z",
    updated_at: "2024-01-22T10:00:00Z",
  },
  {
    product_id: "prod10",
    sku: "SNK-002",
    name: "Pringles Sour Cream 110g",
    category_id: "cat3",
    cost_price: 45,
    selling_price: 75,
    unit: "can",
    min_stock: 20,
    current_stock: 35,
    created_at: "2024-01-23T11:00:00Z",
    updated_at: "2024-01-23T11:00:00Z",
  },
  {
    product_id: "prod11",
    sku: "DRY-002",
    name: "Greek Yogurt 150g",
    category_id: "cat4",
    cost_price: 22,
    selling_price: 39,
    unit: "cup",
    min_stock: 15,
    current_stock: 5,
    created_at: "2024-01-24T09:00:00Z",
    updated_at: "2024-01-24T09:00:00Z",
  },
  {
    product_id: "prod12",
    sku: "BKR-002",
    name: "Croissant",
    category_id: "cat5",
    cost_price: 18,
    selling_price: 35,
    unit: "piece",
    min_stock: 12,
    current_stock: 28,
    created_at: "2024-01-25T12:00:00Z",
    updated_at: "2024-01-25T12:00:00Z",
  },
  {
    product_id: "prod13",
    sku: "FRZ-002",
    name: "Frozen Chicken Nuggets 500g",
    category_id: "cat6",
    cost_price: 95,
    selling_price: 169,
    unit: "bag",
    min_stock: 10,
    current_stock: 24,
    created_at: "2024-01-26T13:00:00Z",
    updated_at: "2024-01-26T13:00:00Z",
  },
  {
    product_id: "prod14",
    sku: "PRD-002",
    name: "Apple Fuji 1kg",
    category_id: "cat7",
    cost_price: 60,
    selling_price: 99,
    unit: "kg",
    min_stock: 15,
    current_stock: 42,
    created_at: "2024-01-27T08:00:00Z",
    updated_at: "2024-01-27T08:00:00Z",
  },
  {
    product_id: "prod15",
    sku: "CDM-002",
    name: "Tomato Ketchup 300g",
    category_id: "cat8",
    cost_price: 28,
    selling_price: 49,
    unit: "bottle",
    min_stock: 12,
    current_stock: 38,
    created_at: "2024-01-28T15:00:00Z",
    updated_at: "2024-01-28T15:00:00Z",
  },
];

export const useMockProductData = () => {
  const getMockProductList = async ({
    page,
    limit,
    criteria,
    sort_bys,
  }: GetMockProductListParams): Promise<GetMockProductListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    if (MOCK_PRODUCT_LIST.length === 0) {
      return { data: EMPTY_DATA };
    }

    const search = criteria?.search?.toLowerCase().trim() ?? "";

    const filtered = search
      ? MOCK_PRODUCT_LIST.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search),
        )
      : [...MOCK_PRODUCT_LIST];

    const sort = sort_bys?.[0];
    if (sort?.field && sort.direction) {
      const field = sort.field as keyof ProductList;
      const dir = sort.direction === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
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

  return { getMockProductList };
};
