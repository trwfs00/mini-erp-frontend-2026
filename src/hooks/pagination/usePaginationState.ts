import { useState } from "react";

export type UsePaginationStateReturnType = {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalCount: number;
  setTotalCount: (totalCount: number) => void;
  totalPage: number;
  setTotalPage: (totalPage: number) => void;
  reset: () => void;
};

export const usePaginationState = (
  defaultPage: number = 1,
  defaultLimit: number = 10,
): UsePaginationStateReturnType => {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const reset = (): void => {
    setPage(defaultPage);
    setLimit(defaultLimit);
    setTotalCount(0);
    setTotalPage(0);
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
    setTotalCount,
    totalPage,
    setTotalPage,
    reset,
  };
};
