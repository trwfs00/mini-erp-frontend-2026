import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetStockSummaryResponse,
  GetStockMovementResponse,
  GetPurchaseSummaryResponse,
} from "./types/ReportResponse";
import type {
  StockMovementRangeRequest,
  PurchaseSummaryMonthRequest,
  StockMovementExportRequest,
  PurchaseSummaryExportRequest,
} from "./types/ReportRequest";

export const ReportService = {
  async getStockSummary(): Promise<ApiReturn<GetStockSummaryResponse>> {
    return AxiosUtil.createRequest<GetStockSummaryResponse>({
      url: "/reports/stock-summary",
      method: "GET",
    });
  },

  async getStockMovement(
    request: StockMovementRangeRequest,
  ): Promise<ApiReturn<GetStockMovementResponse>> {
    return AxiosUtil.createRequest<GetStockMovementResponse>({
      url: "/reports/stock-movements",
      method: "GET",
      params: request,
    });
  },

  async getPurchaseSummary(
    request: PurchaseSummaryMonthRequest,
  ): Promise<ApiReturn<GetPurchaseSummaryResponse>> {
    return AxiosUtil.createRequest<GetPurchaseSummaryResponse>({
      url: "/reports/purchase-summary",
      method: "GET",
      params: request,
    });
  },

  async exportStockSummary(): Promise<ApiReturn<Blob>> {
    return AxiosUtil.createRequest<Blob>({
      url: "/reports/stock-summary/export",
      method: "GET",
      params: { format: "csv" },
      responseType: "blob",
    });
  },

  async exportStockMovement(
    request: StockMovementExportRequest,
  ): Promise<ApiReturn<Blob>> {
    return AxiosUtil.createRequest<Blob>({
      url: "/reports/stock-movements/export",
      method: "GET",
      params: request,
      responseType: "blob",
    });
  },

  async exportPurchaseSummary(
    request: PurchaseSummaryExportRequest,
  ): Promise<ApiReturn<Blob>> {
    return AxiosUtil.createRequest<Blob>({
      url: "/reports/purchase-summary/export",
      method: "GET",
      params: request,
      responseType: "blob",
    });
  },
};
