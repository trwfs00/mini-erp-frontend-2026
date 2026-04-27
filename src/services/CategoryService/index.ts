import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetCategoryListResponse,
  GetCategoryResponse,
  SaveCategoryResponse,
} from "./types/CategoryResponse";
import type {
  GetCategoryListRequest,
  SaveCategoryRequest,
} from "./types/CategoryRequest";
import type { CategoryDropdown } from "@/types/category/CategoryDropdown";

export const CategoryService = {
  async getCategoryList(
    request: GetCategoryListRequest,
  ): Promise<ApiReturn<GetCategoryListResponse>> {
    return AxiosUtil.createRequest<GetCategoryListResponse>({
      url: "/category/list",
      method: "GET",
      params: request,
    });
  },

  async getCategory(
    categoryId: string,
  ): Promise<ApiReturn<GetCategoryResponse>> {
    return AxiosUtil.createRequest<GetCategoryResponse>({
      url: `/category/${categoryId}`,
      method: "GET",
    });
  },

  async saveCategory(
    request: SaveCategoryRequest,
  ): Promise<ApiReturn<SaveCategoryResponse>> {
    return AxiosUtil.createRequest<SaveCategoryResponse>({
      url: "/category",
      method: "POST",
      data: request,
    });
  },

  async deleteCategory(categoryId: string): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: `/category/${categoryId}`,
      method: "DELETE",
    });
  },

  async getCategoryForDropdown(): Promise<ApiReturn<CategoryDropdown[]>> {
    return AxiosUtil.createRequest<CategoryDropdown[]>({
      url: "/category/dropdown",
      method: "GET",
    });
  },
};
