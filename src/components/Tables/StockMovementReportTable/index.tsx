import { Text } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import { TransactionTypeBadge } from "@/components/Badges/TransactionTypeBadge";
import { formatDate } from "@/utils/DateUtil";
import type { StockMovementRow } from "@/types/report/StockMovementReport";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tReport } from "@/consts/translations/tReport";

type Props = {
  records: StockMovementRow[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
  isLoadingInitial?: boolean;
};

export const StockMovementReportTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
  isLoadingInitial,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<StockMovementRow>[] = [
    {
      accessor: "created_at",
      title: t(tReport.stockMovement.thead.date),
      sortable: true,
      width: 130,
      render: (r) => (
        <Text fz="sm" c="dimmed">
          {formatDate(r.created_at)}
        </Text>
      ),
    },
    {
      accessor: "product_name",
      title: t(tReport.stockMovement.thead.product),
      sortable: true,
      render: (r) => (
        <Text fz="sm" fw={500}>
          {r.product_name}
        </Text>
      ),
    },
    {
      accessor: "type",
      title: t(tReport.stockMovement.thead.type),
      sortable: true,
      width: 110,
      render: (r) => <TransactionTypeBadge type={r.type} />,
    },
    {
      accessor: "quantity",
      title: t(tReport.stockMovement.thead.qty),
      sortable: true,
      textAlign: "right",
      width: 90,
    },
    {
      accessor: "balance_after",
      title: t(tReport.stockMovement.thead.balance),
      sortable: true,
      textAlign: "right",
      width: 100,
    },
    {
      accessor: "created_by_name",
      title: t(tReport.stockMovement.thead.by),
      width: 160,
      render: (r) => (
        <Text fz="sm" c="dimmed">
          {r.created_by_name}
        </Text>
      ),
    },
    {
      accessor: "note",
      title: t(tReport.stockMovement.thead.note),
      render: (r) => (
        <Text fz="sm" c="dimmed">
          {r.note ?? r.reason ?? "-"}
        </Text>
      ),
    },
  ];

  return (
    <InstantTable<StockMovementRow>
      idAccessor="transaction_id"
      columns={columns}
      records={records}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={{ th: "การเคลื่อนไหว", en: "movement" }}
      fetching={isLoading}
      isLoadingInitial={isLoadingInitial}
    />
  );
};
