import type { ResponseTable } from "@/types/api/ResponseTable";
import type { SupplierList } from "@/types/supplier/SupplierList";

export type GetSupplierListResponse = ResponseTable<SupplierList>;

export type GetSupplierResponse = SupplierList;

export type SaveSupplierResponse = SupplierList;
