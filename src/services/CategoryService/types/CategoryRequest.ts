import type { RequestTable } from "@/types/api/RequestTable";

export type GetCategoryListRequest = RequestTable<{
  search?: string;
}>;

export type SaveCategoryRequest = {
  category_id?: string | null;
  name: string;
  description: string;
};
