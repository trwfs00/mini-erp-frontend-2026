import type { ApiReturn } from "@/types/api/ApiReturn";
import { AxiosUtil } from "@/utils/AxiosUtil";
import { $mockMode } from "@/stores/debugModeStore";
import type {
  GetSupplierListResponse,
  GetSupplierResponse,
  SaveSupplierResponse,
} from "./types/SupplierResponse";
import type {
  GetSupplierListRequest,
  SaveSupplierRequest,
} from "./types/SupplierRequest";
import type { SupplierList } from "@/types/supplier/SupplierList";

const MOCK_SUPPLIERS: SupplierList[] = [
  {
    supplier_id: "SUP-001",
    name: "Global Foods Co., Ltd.",
    phone: "02-123-4567",
    email: "contact@globalfoods.com",
    address: "123 Sukhumvit Rd, Bangkok, Thailand",
    created_at: "2026-01-01T09:00:00Z",
    updated_at: "2026-01-01T09:00:00Z",
  },
  {
    supplier_id: "SUP-002",
    name: "Best Beverages Inc.",
    phone: "081-987-6543",
    email: "info@bestbev.com",
    address: "456 Ratchadaphisek Rd, Bangkok, Thailand",
    created_at: "2026-01-05T10:00:00Z",
    updated_at: "2026-01-05T10:00:00Z",
  },
  {
    supplier_id: "SUP-003",
    name: "Premium Packaging Solutions",
    phone: "02-555-0199",
    email: "sales@premiumpack.co.th",
    address: "789 Bang Na-Trad Rd, Samut Prakan, Thailand",
    created_at: "2026-02-10T14:00:00Z",
    updated_at: "2026-02-10T14:00:00Z",
  },
];

export const SupplierService = {
  async getSupplierList(
    request: GetSupplierListRequest,
  ): Promise<ApiReturn<GetSupplierListResponse>> {
    const isDebug = $mockMode.get();

    if (isDebug) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[Mock] Fetching suppliers with request:", request);

          let filtered = MOCK_SUPPLIERS;
          if (request.criteria?.search) {
            const lowerCaseSearch = request.criteria.search.toLowerCase();
            filtered = MOCK_SUPPLIERS.filter(
              (s) =>
                s.name.toLowerCase().includes(lowerCaseSearch) ||
                s.email.toLowerCase().includes(lowerCaseSearch) ||
                s.phone.includes(lowerCaseSearch),
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

    return AxiosUtil.createRequest<GetSupplierListResponse>({
      url: "/supplier/list",
      method: "GET",
      params: request,
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
};
