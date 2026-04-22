import type { ResponseTable } from "@/types/api/response-table";
import type { CategoryList } from "@/types/category/category-list";

export type GetCategoryListResponse = ResponseTable<CategoryList>;

export type GetCategoryResponse = CategoryList;

export type SaveCategoryResponse = CategoryList;
