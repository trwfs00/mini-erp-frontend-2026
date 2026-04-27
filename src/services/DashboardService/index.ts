import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type { GetDashboardStatsResponse } from "./types/DashboardResponse";

export const DashboardService = {
  async getDashboardStats(): Promise<ApiReturn<GetDashboardStatsResponse>> {
    return AxiosUtil.createRequest<GetDashboardStatsResponse>({
      url: "/dashboard/stats",
      method: "GET",
    });
  },
};
