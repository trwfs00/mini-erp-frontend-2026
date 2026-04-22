import type { ResponseTable } from "@/types/api/ResponseTable";
import type { CategoryList } from "@/types/category/CategoryList";

export type GetCategoryListResponse = ResponseTable<CategoryList>;

export type GetCategoryResponse = CategoryList;

export type SaveCategoryResponse = CategoryList;
