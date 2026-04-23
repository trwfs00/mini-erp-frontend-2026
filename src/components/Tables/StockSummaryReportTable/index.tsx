import { Badge, Text } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import type { StockSummaryRow } from "@/types/report/StockSummary";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";

type Props = {
  records: StockSummaryRow[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
};

const columns: DataTableColumn<StockSummaryRow>[] = [
  {
    accessor: "sku",
    title: "SKU",
    sortable: true,
    width: 120,
    render: (r) => <Text fz="sm" c="gray.6">{r.sku}</Text>,
  },
  {
    accessor: "name",
    title: "Name",
    sortable: true,
    render: (r) => <Text fz="sm" fw={500}>{r.name}</Text>,
  },
  {
    accessor: "current_stock",
    title: "Current",
    sortable: true,
    textAlign: "right",
    width: 110,
    render: (r) => `${r.current_stock} ${r.unit}`,
  },
  { accessor: "min_stock", title: "Min", sortable: true, textAlign: "right", width: 80 },
  {
    accessor: "cost_price",
    title: "Cost",
    sortable: true,
    textAlign: "right",
    width: 110,
    render: (r) => formatCurrency(r.cost_price),
  },
  {
    accessor: "selling_price",
    title: "Sell",
    sortable: true,
    textAlign: "right",
    width: 110,
    render: (r) => formatCurrency(r.selling_price),
  },
  {
    accessor: "cost_value",
    title: "Cost Value",
    sortable: true,
    textAlign: "right",
    width: 140,
    render: (r) => formatCurrency(r.cost_value),
  },
  {
    accessor: "selling_value",
    title: "Sell Value",
    sortable: true,
    textAlign: "right",
    width: 140,
    render: (r) => formatCurrency(r.selling_value),
  },
  {
    accessor: "is_low_stock",
    title: "Status",
    width: 90,
    render: (r) =>
      r.is_low_stock ? (
        <Badge color="red" variant="light" radius="sm">Low</Badge>
      ) : (
        <Badge color="green" variant="light" radius="sm">OK</Badge>
      ),
  },
];

export const StockSummaryReportTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
}) => (
  <InstantTable<StockSummaryRow>
    idAccessor="product_id"
    columns={columns}
    records={records}
    pagination={pagination}
    sortHandler={sortHandler}
    entityName="stock summary"
    fetching={isLoading}
  />
);
