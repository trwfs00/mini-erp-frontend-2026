import type { RequestTable } from "@/types/api/request-table";

export type GetSupplierListRequest = RequestTable<{
  search?: string;
}>;

export type SaveSupplierRequest = {
  supplier_id?: string | null;
  name: string;
  phone: string;
  email: string;
  address: string;
};
