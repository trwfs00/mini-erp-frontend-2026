import type { ResponseTable } from "@/types/api/ResponseTable";
import type { ProductList } from "@/types/product/ProductList";

export type GetProductListResponse = ResponseTable<ProductList>;

export type GetProductResponse = ProductList;

export type SaveProductResponse = ProductList;
