import type { ApiReturn } from "@/types/api/api-return";
import { AxiosUtil } from "@/utils/axios-util";
import { $debugMode } from "@/stores/debug-mode-store";
import type {
  GetProductListResponse,
  GetProductResponse,
  SaveProductResponse,
} from "./types/product-response";
import type {
  GetProductListRequest,
  SaveProductRequest,
} from "./types/product-request";
import type { ProductList } from "@/types/product/product-list";

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
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-04-21T13:00:00Z",
  },
];

export class ProductService {
  static async getProductList(
    request: GetProductListRequest,
  ): Promise<ApiReturn<GetProductListResponse>> {
    const isDebug = $debugMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.debug("[Mock] Fetching products with request:", request);
          
          let filtered = MOCK_PRODUCTS;
          if (request.criteria?.search) {
             const lowerCaseSearch = request.criteria.search.toLowerCase();
             filtered = MOCK_PRODUCTS.filter(p => 
               p.name.toLowerCase().includes(lowerCaseSearch) || 
               p.sku.toLowerCase().includes(lowerCaseSearch)
             );
          }

          resolve({
            ok: true,
            data: {
              data: filtered,
              pagination: { total_page: 1, total_count: filtered.length },
            },
          });
        }, 500); // Simulate network delay
      });
    }

    return AxiosUtil.createRequest<GetProductListResponse>({
      url: "/product/list",
      method: "GET",
      params: request,
    });
  }

  static async getProduct(
    productId: string,
  ): Promise<ApiReturn<GetProductResponse>> {
    return AxiosUtil.createRequest<GetProductResponse>({
      url: `/product/${productId}`,
      method: "GET",
    });
  }

  static async saveProduct(
    request: SaveProductRequest,
  ): Promise<ApiReturn<SaveProductResponse>> {
    return AxiosUtil.createRequest<SaveProductResponse>({
      url: "/product",
      method: "POST",
      data: request,
    });
  }

  static async deleteProduct(productId: string): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: `/product/${productId}`,
      method: "DELETE",
    });
  }
}
