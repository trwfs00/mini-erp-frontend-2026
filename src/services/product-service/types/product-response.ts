import type { ResponseTable } from "@/types/api/response-table";
import type { ProductList } from "@/types/product/product-list";

export type GetProductListResponse = ResponseTable<ProductList>;

export type GetProductResponse = ProductList;

export type SaveProductResponse = ProductList;
