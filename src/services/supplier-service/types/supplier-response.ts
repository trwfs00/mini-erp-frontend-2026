import type { ResponseTable } from "@/types/api/response-table";
import type { SupplierList } from "@/types/supplier/supplier-list";

export type GetSupplierListResponse = ResponseTable<SupplierList>;

export type GetSupplierResponse = SupplierList;

export type SaveSupplierResponse = SupplierList;
