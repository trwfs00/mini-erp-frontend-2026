import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetStockListResponse,
  StockSummaryResponse,
} from "./types/StockResponse";
import type {
  GetStockListRequest,
  CreateStockTransactionRequest,
} from "./types/StockRequest";

export const StockService = {
  async getTransactionList(
    request: GetStockListRequest,
  ): Promise<ApiReturn<GetStockListResponse>> {
    return AxiosUtil.createRequest<GetStockListResponse>({
      url: "/stock/list",
      method: "GET",
      params: request,
    });
  },

  async stockIn(data: CreateStockTransactionRequest): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: "/stock/in",
      method: "POST",
      data,
    });
  },

  async stockOut(
    data: CreateStockTransactionRequest,
  ): Promise<ApiReturn<void>> {
    // For mock/local validation if needed, but usually handled by backend
    return AxiosUtil.createRequest<void>({
      url: "/stock/out",
      method: "POST",
      data,
    });
  },

  async stockAdjust(
    data: CreateStockTransactionRequest,
  ): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: "/stock/adjust",
      method: "POST",
      data,
    });
  },

  async getStockSummary(
    productId: string,
  ): Promise<ApiReturn<StockSummaryResponse>> {
    return AxiosUtil.createRequest<StockSummaryResponse>({
      url: `/products/${productId}/stock-summary`,
      method: "GET",
    });
  },
};
