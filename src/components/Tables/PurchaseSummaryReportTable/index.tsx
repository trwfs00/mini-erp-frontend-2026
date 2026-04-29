import { Text } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import { PurchaseOrderStatusBadge } from "@/components/Badges/PurchaseOrderStatusBadge";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { formatDate } from "@/utils/DateUtil";
import type { PurchaseSummaryRow } from "@/types/report/PurchaseSummary";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";

type Props = {
  records: PurchaseSummaryRow[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
};

const columns: DataTableColumn<PurchaseSummaryRow>[] = [
  {
    accessor: "purchase_order_id",
    title: "PO ID",
    sortable: true,
    width: 160,
    render: (r) => (
      <Text fz="sm" fw={500}>
        {r.purchase_order_id}
      </Text>
    ),
  },
  {
    accessor: "supplier_name",
    title: "Supplier",
    sortable: true,
    render: (r) => <Text fz="sm">{r.supplier_name}</Text>,
  },
  {
    accessor: "status",
    title: "Status",
    sortable: true,
    width: 120,
    render: (r) => <PurchaseOrderStatusBadge status={r.status} />,
  },
  {
    accessor: "item_count",
    title: "Items",
    sortable: true,
    textAlign: "right",
    width: 90,
  },
  {
    accessor: "total_amount",
    title: "Total",
    sortable: true,
    textAlign: "right",
    width: 140,
    render: (r) => formatCurrency(r.total_amount),
  },
  {
    accessor: "created_at",
    title: "Created",
    sortable: true,
    width: 140,
    render: (r) => (
      <Text fz="sm" c="dimmed">
        {formatDate(r.created_at)}
      </Text>
    ),
  },
  {
    accessor: "created_by_name",
    title: "By",
    width: 160,
    render: (r) => (
      <Text fz="sm" c="dimmed">
        {r.created_by_name}
      </Text>
    ),
  },
];

export const PurchaseSummaryReportTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
}) => (
  <InstantTable<PurchaseSummaryRow>
    idAccessor="purchase_order_id"
    columns={columns}
    records={records}
    pagination={pagination}
    sortHandler={sortHandler}
    entityName="purchase orders"
    fetching={isLoading}
  />
);
