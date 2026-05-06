import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetDashboardSummaryResponse,
  GetDashboardStockMovementResponse,
  GetDashboardPurchaseTrendResponse,
  GetDashboardLowStockResponse,
} from "./types/DashboardResponse";

export const DashboardService = {
  async getSummary(): Promise<ApiReturn<GetDashboardSummaryResponse>> {
    return AxiosUtil.createRequest<GetDashboardSummaryResponse>({
      url: "/dashboard/summary",
      method: "GET",
    });
  },

  async getStockMovement(): Promise<
    ApiReturn<GetDashboardStockMovementResponse>
  > {
    return AxiosUtil.createRequest<GetDashboardStockMovementResponse>({
      url: "/dashboard/stock-movement",
      method: "GET",
    });
  },

  async getPurchaseTrend(): Promise<
    ApiReturn<GetDashboardPurchaseTrendResponse>
  > {
    return AxiosUtil.createRequest<GetDashboardPurchaseTrendResponse>({
      url: "/dashboard/purchase-trend",
      method: "GET",
    });
  },

  async getLowStock(): Promise<ApiReturn<GetDashboardLowStockResponse>> {
    return AxiosUtil.createRequest<GetDashboardLowStockResponse>({
      url: "/dashboard/low-stock",
      method: "GET",
    });
  },
};
