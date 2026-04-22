import type { OrderBy } from "../SortOrder";

export type RequestTable<T> = {
  criteria: T;
  sort_bys: Array<{
    field: string;
    direction: OrderBy;
  }>;
  page: number;
  limit: number;
};
