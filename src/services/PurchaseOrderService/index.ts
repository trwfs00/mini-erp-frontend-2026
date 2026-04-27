import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetPurchaseOrderListResponse,
  GetPurchaseOrderResponse,
  SavePurchaseOrderResponse,
} from "./types/PurchaseOrderResponse";
import type {
  GetPurchaseOrderListRequest,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderStatusRequest,
} from "./types/PurchaseOrderRequest";

export const PurchaseOrderService = {
  async getPurchaseOrderList(
    request: GetPurchaseOrderListRequest,
  ): Promise<ApiReturn<GetPurchaseOrderListResponse>> {
    return AxiosUtil.createRequest<GetPurchaseOrderListResponse>({
      url: "/purchase-orders",
      method: "GET",
      params: request,
    });
  },

  async getPurchaseOrder(
    id: string,
  ): Promise<ApiReturn<GetPurchaseOrderResponse>> {
    return AxiosUtil.createRequest<GetPurchaseOrderResponse>({
      url: `/purchase-orders/${id}`,
      method: "GET",
    });
  },

  async createPurchaseOrder(
    request: CreatePurchaseOrderRequest,
  ): Promise<ApiReturn<SavePurchaseOrderResponse>> {
    return AxiosUtil.createRequest<SavePurchaseOrderResponse>({
      url: "/purchase-orders",
      method: "POST",
      data: request,
    });
  },

  async updateStatus(
    id: string,
    request: UpdatePurchaseOrderStatusRequest,
  ): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: `/purchase-orders/${id}/status`,
      method: "PATCH",
      data: request,
    });
  },
};
