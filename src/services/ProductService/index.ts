import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $mockMode } from "@/stores/debugModeStore";
import type {
  GetProductListResponse,
  GetProductResponse,
  SaveProductResponse,
} from "./types/ProductResponse";
import type {
  GetProductListRequest,
  SaveProductRequest,
} from "./types/ProductRequest";
import type { ProductList } from "@/types/product/ProductList";

const MOCK_PRODUCTS: ProductList[] = [
  {
    product_id: "P001",
    sku: "SKU-0001",
    name: "Coca-Cola 325ml",
    category_id: "CAT-BEV",
    cost_price: 8,
    selling_price: 15,
    unit: "can",
    min_stock: 24,
    current_stock: 45,
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-04-01T10:15:00Z",
  },
  {
    product_id: "P002",
    sku: "SKU-0002",
    name: "Lay's Classic 50g",
    category_id: "CAT-SNK",
    cost_price: 12,
    selling_price: 20,
    unit: "pack",
    min_stock: 30,
    current_stock: 5,
    created_at: "2026-01-12T09:00:00Z",
    updated_at: "2026-04-05T11:00:00Z",
  },
  {
    product_id: "P003",
    sku: "SKU-0003",
    name: "Mama Instant Noodle",
    category_id: "CAT-FOOD",
    cost_price: 5,
    selling_price: 8,
    unit: "pack",
    min_stock: 50,
    current_stock: 120,
    created_at: "2026-01-15T09:00:00Z",
    updated_at: "2026-03-20T14:30:00Z",
  },
  {
    product_id: "P004",
    sku: "SKU-0004",
    name: "Nescafe 3-in-1",
    category_id: "CAT-BEV",
    cost_price: 3,
    selling_price: 6,
    unit: "sachet",
    min_stock: 100,
    current_stock: 40,
    created_at: "2026-01-18T09:00:00Z",
    updated_at: "2026-04-10T09:45:00Z",
  },
  {
    product_id: "P005",
    sku: "SKU-0005",
    name: "Pocky Chocolate",
    category_id: "CAT-SNK",
    cost_price: 15,
    selling_price: 25,
    unit: "box",
    min_stock: 20,
    current_stock: 15,
    created_at: "2026-01-20T09:00:00Z",
    updated_at: "2026-04-12T16:00:00Z",
  },
  {
    product_id: "P006",
    sku: "SKU-0006",
    name: "Oishi Green Tea 500ml",
    category_id: "CAT-BEV",
    cost_price: 14,
    selling_price: 22,
    unit: "bottle",
    min_stock: 24,
    current_stock: 60,
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-04-15T08:20:00Z",
  },
  {
    product_id: "P007",
    sku: "SKU-0007",
    name: "Pepsi 1.25L",
    category_id: "CAT-BEV",
    cost_price: 22,
    selling_price: 35,
    unit: "bottle",
    min_stock: 15,
    current_stock: 8,
    created_at: "2026-02-05T09:00:00Z",
    updated_at: "2026-04-18T12:10:00Z",
  },
  {
    product_id: "P008",
    sku: "SKU-0008",
    name: "Singha Water 600ml",
    category_id: "CAT-BEV",
    cost_price: 6,
    selling_price: 10,
    unit: "bottle",
    min_stock: 48,
    current_stock: 100,
    created_at: "2026-02-08T09:00:00Z",
    updated_at: "2026-04-19T09:30:00Z",
  },
  {
    product_id: "P009",
    sku: "SKU-0009",
    name: "Tasto Potato Chips",
    category_id: "CAT-SNK",
    cost_price: 13,
    selling_price: 20,
    unit: "pack",
    min_stock: 25,
    current_stock: 10,
    created_at: "2026-02-12T09:00:00Z",
    updated_at: "2026-04-20T15:00:00Z",
  },
  {
    product_id: "P010",
    sku: "SKU-0010",
    name: "KitKat 4-Finger",
    category_id: "CAT-SNK",
    cost_price: 18,
    selling_price: 30,
    unit: "bar",
    min_stock: 20,
    current_stock: 35,
    created_at: "2026-02-15T09:00:00Z",
    updated_at: "2026-04-21T10:00:00Z",
  },
  {
    product_id: "P011",
    sku: "SKU-0011",
    name: "Yum Yum Cup Noodle",
    category_id: "CAT-FOOD",
    cost_price: 10,
    selling_price: 15,
    unit: "cup",
    min_stock: 40,
    current_stock: 5,
    created_at: "2026-02-20T09:00:00Z",
    updated_at: "2026-04-21T11:20:00Z",
  },
  {
    product_id: "P012",
    sku: "SKU-0012",
    name: "Dutch Mill Yogurt",
    category_id: "CAT-DAIRY",
    cost_price: 9,
    selling_price: 14,
    unit: "bottle",
    min_stock: 30,
    current_stock: 42,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-04-21T13:00:00Z",
  },
];

export const ProductService = {
  async getProductList(
    request: GetProductListRequest,
  ): Promise<ApiReturn<GetProductListResponse>> {
    const isDebug = $mockMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[Mock] Fetching products with request:", request);

          let filtered = MOCK_PRODUCTS;
          if (request.criteria?.search) {
            const lowerCaseSearch = request.criteria.search.toLowerCase();
            filtered = MOCK_PRODUCTS.filter(
              (p) =>
                p.name.toLowerCase().includes(lowerCaseSearch) ||
                p.sku.toLowerCase().includes(lowerCaseSearch),
            );
          }

          // Sorting logic
          if (request.sort_bys && request.sort_bys.length > 0) {
            const { field, direction } = request.sort_bys[0];
            filtered = [...filtered].sort((a, b) => {
              const valA = a[field as keyof ProductList];
              const valB = b[field as keyof ProductList];
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
        }, 500); // Simulate network delay
      });
    }

    return AxiosUtil.createRequest<GetProductListResponse>({
      url: "/product",
      method: "GET",
      params: request,
    });
  },

  async getProduct(productId: string): Promise<ApiReturn<GetProductResponse>> {
    return AxiosUtil.createRequest<GetProductResponse>({
      url: `/product/${productId}`,
      method: "GET",
    });
  },

  async saveProduct(
    request: SaveProductRequest,
  ): Promise<ApiReturn<SaveProductResponse>> {
    return AxiosUtil.createRequest<SaveProductResponse>({
      url: "/product",
      method: "POST",
      data: request,
    });
  },

  async deleteProduct(productId: string): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: `/product/${productId}`,
      method: "DELETE",
    });
  },
};
