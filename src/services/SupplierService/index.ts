import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import type {
  GetSupplierListResponse,
  GetSupplierResponse,
  SaveSupplierResponse,
} from "./types/SupplierResponse";
import type {
  GetSupplierListRequest,
  SaveSupplierRequest,
} from "./types/SupplierRequest";
import type { SupplierDropdown } from "@/types/supplier/SupplierDropdown";

export const SupplierService = {
  async getSupplierList(
    request: GetSupplierListRequest,
  ): Promise<ApiReturn<GetSupplierListResponse>> {
    return AxiosUtil.createRequest<GetSupplierListResponse>({
      url: "/supplier/list",
      method: "POST",
      data: request,
    });
  },

  async getSupplier(
    supplierId: string,
  ): Promise<ApiReturn<GetSupplierResponse>> {
    return AxiosUtil.createRequest<GetSupplierResponse>({
      url: `/supplier/${supplierId}`,
      method: "GET",
    });
  },

  async saveSupplier(
    request: SaveSupplierRequest,
  ): Promise<ApiReturn<SaveSupplierResponse>> {
    return AxiosUtil.createRequest<SaveSupplierResponse>({
      url: "/supplier",
      method: "POST",
      data: request,
    });
  },

  async deleteSupplier(supplierId: string): Promise<ApiReturn<void>> {
    return AxiosUtil.createRequest<void>({
      url: `/supplier/${supplierId}`,
      method: "DELETE",
    });
  },

  async getSupplierForDropdown(): Promise<ApiReturn<SupplierDropdown[]>> {
    return AxiosUtil.createRequest<SupplierDropdown[]>({
      url: "/supplier/dropdown",
      method: "GET",
    });
  },
};
