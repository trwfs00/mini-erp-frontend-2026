import type { OrderBy } from "../sort-order";

export type RequestTable<T> = {
  criteria: T;
  sort_bys: Array<{
    field: string;
    direction: OrderBy;
  }>;
  page: number;
  limit: number;
};
