import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import { Skeleton } from "@mantine/core";
import { ChevronsUpDownIcon, ChevronsUpIcon } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from "mantine-datatable";
import { CustomPagination } from "./components/CustomPagination";
import { EmptyState } from "./components/EmptyState";
import classes from "./InstantTable.module.css";

const SKELETON_ROW_COUNT = 8;

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
  isLoadingInitial?: boolean;
};

export const InstantTable = <T,>({
  pagination,
  sortHandler,
  entityName,
  height = 526,
  minHeight = 526,
  isLoadingInitial,
  ...restProps
}: Props<T>) => {
  const sortProps = sortHandler ? sortHandler.getSortProps() : {};

  const skeletonRecords = Array.from(
    { length: SKELETON_ROW_COUNT },
    (_, i) => ({ __skeleton_id: i }) as unknown as T,
  );

  const skeletonColumns: DataTableColumn<T>[] = restProps.columns.map((col) => ({
    ...col,
    sortable: false,
    render: () => (
      <Skeleton
        height={14}
        width={`${50 + Math.floor(Math.random() * 35)}%`}
        radius="sm"
      />
    ),
  }));

  const records = isLoadingInitial ? skeletonRecords : restProps.records;
  const columns = isLoadingInitial ? skeletonColumns : restProps.columns;
  const idAccessor = isLoadingInitial
    ? ("__skeleton_id" as keyof T)
    : restProps.idAccessor;

  const baseProps = {
    ...restProps,
    ...sortProps,
    records,
    columns,
    idAccessor,
    withTableBorder: false,
    borderRadius: 0,
    height,
    minHeight,
    highlightOnHover: !isLoadingInitial,
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
