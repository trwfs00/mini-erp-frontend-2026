import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { StockTransaction } from "@/types/stock/StockTransaction";
import { Text, Group } from "@mantine/core";
import { TransactionTypeBadge } from "@/components/Badges/TransactionTypeBadge";
import type { DataTableColumn } from "mantine-datatable";
import { formatDateTime } from "@/utils/DateUtil";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tStockList } from "@/consts/translations/tStockList";

type Props = {
  records: StockTransaction[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
};

export const StockTransactionTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<StockTransaction>[] = [
    {
      accessor: "created_at",
      title: t(tStockList.thead.date),
      sortable: true,
      width: 160,
      render: ({ created_at }) => (
        <Text fz="sm">{formatDateTime(created_at)}</Text>
      ),
    },
    {
      accessor: "product_name",
      title: t(tStockList.thead.product),
      sortable: true,
      render: ({ product_name, product_id }) => (
        <Group gap="xs">
          <Text fz="sm" fw={500}>
            {product_name}
          </Text>
          <Text fz="xs" c="dimmed">
            ({product_id})
          </Text>
        </Group>
      ),
    },
    {
      accessor: "type",
      title: t(tStockList.thead.type),
      sortable: true,
      width: 100,
      render: ({ type }) => <TransactionTypeBadge type={type} />,
    },
    {
      accessor: "quantity",
      title: t(tStockList.thead.quantity),
      sortable: true,
      textAlign: "right",
      width: 100,
      render: ({ quantity, type }) => {
        const signed =
          type === "OUT"
            ? `-${Math.abs(quantity)}`
            : type === "ADJUST"
              ? `${quantity > 0 ? "+" : ""}${quantity}`
              : `+${quantity}`;
        const negative = type === "OUT" || quantity < 0;
        return (
          <Text fw={600} c={negative ? "red.7" : "gray.9"}>
            {signed}
          </Text>
        );
      },
    },
    {
      accessor: "balance_after",
      title: t(tStockList.thead.balance),
      textAlign: "right",
      width: 100,
      render: ({ balance_after }) => <Text fw={700}>{balance_after}</Text>,
    },
    {
      accessor: "created_by_name",
      title: t(tStockList.thead.by),
      width: 160,
      render: ({ created_by_name }) => (
        <Text fz="sm" c="gray.6">
          {created_by_name}
        </Text>
      ),
    },
    {
      accessor: "note",
      title: t(tStockList.thead.note),
      render: ({ note, reason }) => (
        <Text fz="xs" c="dimmed" lineClamp={1}>
          {reason ? `[Adjust] ${reason}` : note}
        </Text>
      ),
    },
  ];

  return (
    <InstantTable
      idAccessor="transaction_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={tStockList.transaction}
      fetching={isLoading}
    />
  );
};
