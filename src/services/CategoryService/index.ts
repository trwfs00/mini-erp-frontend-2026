import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $mockMode } from "@/stores/debugModeStore";
import type {
  GetCategoryListResponse,
  GetCategoryResponse,
  SaveCategoryResponse,
} from "./types/CategoryResponse";
import type {
  GetCategoryListRequest,
  SaveCategoryRequest,
} from "./types/CategoryRequest";
import type { CategoryList } from "@/types/category/CategoryList";

const MOCK_CATEGORIES: CategoryList[] = [
  {
    category_id: "CAT-BEV",
    name: "Beverages",
    description: "Drinks and beverages including water, juice, and soft drinks",
    created_at: "2026-01-01T09:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
  },
  {
    category_id: "CAT-SNK",
    name: "Snacks",
    description: "Chips, crackers, and other snack foods",
    created_at: "2026-01-01T09:00:00Z",
    updated_at: "2026-04-05T11:00:00Z",
  },
  {
    category_id: "CAT-FOOD",
    name: "Food",
    description: "Instant noodles, canned food, and ready-to-eat meals",
    created_at: "2026-01-01T09:00:00Z",
    updated_at: "2026-04-10T09:00:00Z",
  },
  {
    category_id: "CAT-DAIRY",
    name: "Dairy",
    description: "Milk, yogurt, cheese, and other dairy products",
    created_at: "2026-01-01T09:00:00Z",
    updated_at: "2026-04-15T08:00:00Z",
  },
  {
    category_id: "CAT-CLEAN",
    name: "Cleaning",
    description: "Household cleaning products and supplies",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-04-18T12:00:00Z",
  },
  {
    category_id: "CAT-BAKE",
    name: "Bakery",
    description: "Bread, pastries, and baked goods",
    created_at: "2026-02-10T09:00:00Z",
    updated_at: "2026-04-20T14:00:00Z",
  },
  {
    category_id: "CAT-FRZN",
    name: "Frozen Foods",
    description: "Frozen meals, ice cream, and frozen vegetables",
    created_at: "2026-02-15T09:00:00Z",
    updated_at: "2026-04-21T09:00:00Z",
  },
  {
    category_id: "CAT-HLTH",
    name: "Health & Beauty",
    description: "Personal care, vitamins, and health supplements",
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-04-21T11:00:00Z",
  },
];

export class CategoryService {
  static async getCategoryList(
    request: GetCategoryListRequest,
  ): Promise<ApiReturn<GetCategoryListResponse>> {
    const isDebug = $mockMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[Mock] Fetching categories with request:", request);

          let filtered = MOCK_CATEGORIES;
          if (request.criteria?.search) {
            const lowerCaseSearch = request.criteria.search.toLowerCase();
            filtered = MOCK_CATEGORIES.filter(
              (c) =>
                c.name.toLowerCase().includes(lowerCaseSearch) ||
                c.description.toLowerCase().includes(lowerCaseSearch),
            );
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
        }, 400);
      });
    }

    return AxiosUtil.createRequest<GetCategoryListResponse>({
      url: "/category/list",
      method: "GET",
      params: request,
    });
  }

  static async getCategory(
    categoryId: string,
  ): Promise<ApiReturn<GetCategoryResponse>> {
    return AxiosUtil.createRequest<GetCategoryResponse>({
      url: `/category/${categoryId}`,
      method: "GET",
    });
  }

  static async saveCategory(
    request: SaveCategoryRequest,
  ): Promise<ApiReturn<SaveCategoryResponse>> {
    return AxiosUtil.createRequest<SaveCategoryResponse>({
      url: "/category",
      method: "POST",
      data: request,
    });
  }

  static async deleteCategory(categoryId: string): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: `/category/${categoryId}`,
      method: "DELETE",
    });
  }
}
