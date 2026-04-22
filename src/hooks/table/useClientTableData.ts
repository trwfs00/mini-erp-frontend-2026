import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { useEffect, useMemo } from "react";

type Options = {
  initialPage?: number;
  initialLimit?: number;
};

export const useClientTableData = <T>(
  data: T[],
  { initialPage = 1, initialLimit = 10 }: Options = {},
) => {
  const pagination = usePaginationState(initialPage, initialLimit);
  const sortHandler = useTableSort();

  const { setTotalCount } = pagination;
  const { sortBy, orderBy } = sortHandler;
  const { page, limit } = pagination;

  useEffect(() => {
    setTotalCount(data.length);
  }, [data.length, setTotalCount]);

  const records = useMemo(() => {
    const sorted = [...data];

    if (sortBy) {
      sorted.sort((a, b) => {
        const av = a[sortBy as keyof T];
        const bv = b[sortBy as keyof T];
        if (av == null || bv == null) return 0;
        if (av < bv) return orderBy === "asc" ? -1 : 1;
        if (av > bv) return orderBy === "asc" ? 1 : -1;
        return 0;
      });
    }

    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  }, [data, page, limit, sortBy, orderBy]);

  return { records, pagination, sortHandler };
};
