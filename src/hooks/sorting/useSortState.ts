import type { OrderBy } from "@/types/SortOrder";
import { useState } from "react";

export const useSortState = () => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<OrderBy>(null);

  const toggleSort = (field: string): void => {
    if (sortBy === field) {
      // Toggle order: null -> asc -> desc -> null
      if (orderBy === null) {
        setOrderBy("asc");
      } else if (orderBy === "asc") {
        setOrderBy("desc");
      } else {
        setSortBy(null);
        setOrderBy(null);
      }
    } else {
      // New field, start with asc
      setSortBy(field);
      setOrderBy("asc");
    }
  };

  const resetSort = (): void => {
    setSortBy(null);
    setOrderBy(null);
  };

  return {
    sortBy,
    orderBy,
    setSortBy,
    setOrderBy,
    toggleSort,
    resetSort,
  };
};
