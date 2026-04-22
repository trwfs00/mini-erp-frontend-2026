import type { OrderBy } from "@/types/sort-order";
import type { DataTableSortStatus } from "mantine-datatable";
import { useSortState } from "../sorting/use-sort-state";

export type UseTableSortReturn = {
  sortBy: string | null;
  orderBy: OrderBy;
  setSortBy: (field: string | null) => void;
  setOrderBy: (order: OrderBy) => void;
  toggleSort: (field: string) => void;
  resetSort: () => void;
  getSortProps: <T>() => {
    sortStatus?: DataTableSortStatus<T>;
    onSortStatusChange: (status: DataTableSortStatus<T>) => void;
  };
};

/**
 * Hook สำหรับจัดการ sorting ใน InstantTable
 * ส่ง sortHandler เป็น prop ไปยัง InstantTable component
 *
 * @example
 * const sortHandler = useTableSort();
 *
 * <InstantTable
 *   columns={columns}
 *   records={data}
 *   pagination={pagination}
 *   sortHandler={sortHandler}
 * />
 */
export const useTableSort = (): UseTableSortReturn => {
  const { sortBy, orderBy, setSortBy, setOrderBy, toggleSort, resetSort } =
    useSortState();

  const getSortProps = <T>() => {
    const props: {
      sortStatus?: DataTableSortStatus<T>;
      onSortStatusChange: (status: DataTableSortStatus<T>) => void;
    } = {
      onSortStatusChange: (status: DataTableSortStatus<T>) => {
        toggleSort(String(status.columnAccessor));
      },
    };

    // เพิ่ม sortStatus เฉพาะเมื่อมี sorting active
    if (sortBy && orderBy) {
      props.sortStatus = {
        columnAccessor: sortBy,
        direction: orderBy,
      };
    }

    return props;
  };

  return {
    sortBy,
    orderBy,
    setSortBy,
    setOrderBy,
    toggleSort,
    resetSort,
    getSortProps,
  };
};
