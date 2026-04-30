import { Badge, Text } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import type { StockSummaryRow } from "@/types/report/StockSummary";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tReport } from "@/consts/translations/tReport";

type Props = {
  records: StockSummaryRow[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
};

export const StockSummaryReportTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<StockSummaryRow>[] = [
    {
      accessor: "sku",
      title: t(tReport.stockSummary.thead.sku),
      sortable: true,
      width: 120,
      render: (r) => (
        <Text fz="sm" c="gray.6">
          {r.sku}
        </Text>
      ),
    },
    {
      accessor: "name",
      title: t(tReport.stockSummary.thead.name),
      sortable: true,
      render: (r) => (
        <Text fz="sm" fw={500}>
          {r.name}
        </Text>
      ),
    },
    {
      accessor: "current_stock",
      title: t(tReport.stockSummary.thead.current),
      sortable: true,
      textAlign: "right",
      width: 110,
      render: (r) => `${r.current_stock} ${r.unit}`,
    },
    {
      accessor: "min_stock",
      title: t(tReport.stockSummary.thead.min),
      sortable: true,
      textAlign: "right",
      width: 80,
    },
    {
      accessor: "cost_price",
      title: t(tReport.stockSummary.thead.cost),
      sortable: true,
      textAlign: "right",
      width: 110,
      render: (r) => formatCurrency(r.cost_price),
    },
    {
      accessor: "selling_price",
      title: t(tReport.stockSummary.thead.sell),
      sortable: true,
      textAlign: "right",
      width: 110,
      render: (r) => formatCurrency(r.selling_price),
    },
    {
      accessor: "cost_value",
      title: t(tReport.stockSummary.thead.costValue),
      sortable: true,
      textAlign: "right",
      width: 140,
      render: (r) => formatCurrency(r.cost_value),
    },
    {
      accessor: "selling_value",
      title: t(tReport.stockSummary.thead.sellValue),
      sortable: true,
      textAlign: "right",
      width: 140,
      render: (r) => formatCurrency(r.selling_value),
    },
    {
      accessor: "is_low_stock",
      title: t(tReport.stockSummary.thead.status),
      width: 90,
      render: (r) =>
        r.is_low_stock ? (
          <Badge color="red" variant="light" radius="sm">
            {t(tReport.stockSummary.thead.low)}
          </Badge>
        ) : (
          <Badge color="green" variant="light" radius="sm">
            {t(tReport.stockSummary.thead.ok)}
          </Badge>
        ),
    },
  ];

  return (
    <InstantTable<StockSummaryRow>
      idAccessor="product_id"
      columns={columns}
      records={records}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={{ th: "สรุปสต็อก", en: "stock summary" }}
      fetching={isLoading}
    />
  );
};
