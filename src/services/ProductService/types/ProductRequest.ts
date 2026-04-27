import type { RequestTable } from "@/types/api/RequestTable";

export type GetProductListRequest = RequestTable<{
  search?: string;
}>;

export type SaveProductRequest = {
  product_id?: string | null;
  name: string;
  sku: string;
  category_id: string;
  cost_price: number;
  selling_price: number;
  unit: string;
  min_stock: number;
};
