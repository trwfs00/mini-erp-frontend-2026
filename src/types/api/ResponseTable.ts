import type { Pagination } from "./Pagination";

export type ResponseTable<T> = {
  data: T[];
  pagination: Pagination;
};
