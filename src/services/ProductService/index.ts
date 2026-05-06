import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetProductListResponse,
  GetProductResponse,
  SaveProductResponse,
} from "./types/ProductResponse";
import type {
  GetProductListRequest,
  SaveProductRequest,
} from "./types/ProductRequest";
import type { ProductDropdown } from "@/types/product/ProductDropdown";

export const ProductService = {
  async getProductList(
    request: GetProductListRequest,
  ): Promise<ApiReturn<GetProductListResponse>> {
    return AxiosUtil.createRequest<GetProductListResponse>({
      url: "/product/list",
      method: "POST",
      data: request,
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

  async getProductForDropdown(): Promise<ApiReturn<ProductDropdown[]>> {
    return AxiosUtil.createRequest<ProductDropdown[]>({
      url: "/product/dropdown",
      method: "GET",
    });
  },
};
