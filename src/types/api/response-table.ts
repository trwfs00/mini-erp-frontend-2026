import type { Pagination } from "./pagination";

export type ResponseTable<T> = {
  data: T[];
  pagination: Pagination;
};
