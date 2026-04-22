import type { UsePaginationStateReturnType } from "@/hooks/pagination/use-pagination-state";
import type { UseTableSortReturn } from "@/hooks/table/use-table-sort";
import { ChevronsUpDownIcon, ChevronsUpIcon } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from "mantine-datatable";
import { CustomPagination } from "./components/custom-pagination";
import { EmptyState } from "./components/empty-state";
import classes from "./instant-table.module.css";

type Props<T> = Omit<
  DataTableProps<T>,
  // Pagination props - จัดการโดย pagination prop
  | "totalRecords"
  | "recordsPerPage"
  | "page"
  | "onPageChange"
  | "onRecordsPerPageChange"
  | "renderPagination"
  // Fixed styling props - กำหนดค่าไว้แล้วภายใน component
  | "withTableBorder"
  | "borderRadius"
  // Sorting props - จัดการโดย sortHandler prop
  | "sortStatus"
  | "onSortStatusChange"
  // Empty state props - กำหนดค่าไว้แล้วภายใน component
  | "emptyState"
  | "noRecordsText"
  | "noRecordsIcon"
  // Discriminated union props - ต้อง Omit เพื่อแก้ปัญหา type conflicts
  | "customLoader"
  | "groups"
  | "columns"
  // Required props - จัดการแยกต่างหาก
  | "idAccessor"
> & {
  idAccessor: keyof T;
  columns: DataTableColumn<T>[];
  pagination?: UsePaginationStateReturnType;
  sortHandler?: UseTableSortReturn;
  entityName?: string;
  height?: number;
  minHeight?: number;
};

export const InstantTable = <T,>({
  pagination,
  sortHandler,
  entityName,
  height,
  minHeight = 526,
  ...restProps
}: Props<T>) => {
  const sortProps = sortHandler ? sortHandler.getSortProps() : {};

  const baseProps = {
    ...restProps,
    ...sortProps,
    withTableBorder: false,
    borderRadius: 0,
    height,
    minHeight,
    highlightOnHover: true,
    emptyState: <EmptyState entityName={entityName} />,
    sortIcons: {
      sorted: <ChevronsUpIcon size={14} strokeWidth={2.25} />,
      unsorted: <ChevronsUpDownIcon size={14} strokeWidth={2} />,
    },
  };

  const table = !pagination ? (
    <DataTable {...(baseProps as DataTableProps<T>)} />
  ) : (
    <DataTable
      {...(baseProps as DataTableProps<T>)}
      totalRecords={pagination.totalCount}
      recordsPerPage={pagination.limit}
      page={pagination.page}
      onPageChange={pagination.setPage}
      onRecordsPerPageChange={pagination.setLimit}
      recordsPerPageOptions={[10, 20, 50]}
      renderPagination={({ state, actions }) => (
        <CustomPagination
          state={state}
          actions={{
            ...actions,
            setRecordsPerPage: pagination.setLimit,
          }}
        />
      )}
    />
  );

  return <div className={classes.wrapper}>{table}</div>;
};
