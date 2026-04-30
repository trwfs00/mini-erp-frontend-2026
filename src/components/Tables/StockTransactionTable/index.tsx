import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { StockTransaction } from "@/types/stock/StockTransaction";
import { Text, Group } from "@mantine/core";
import { TransactionTypeBadge } from "@/components/Badges/TransactionTypeBadge";
import type { DataTableColumn } from "mantine-datatable";
import dayjs from "dayjs";

type Props = {
  records: StockTransaction[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
  isLoadingInitial?: boolean;
};

export const StockTransactionTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
  isLoadingInitial,
}) => {
  const columns: DataTableColumn<StockTransaction>[] = [
    {
      accessor: "created_at",
      title: "Date",
      sortable: true,
      width: 160,
      render: ({ created_at }) => (
        <Text fz="sm">{dayjs(created_at).format("DD/MM/YYYY HH:mm")}</Text>
      ),
    },
    {
      accessor: "product_name",
      title: "Product",
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
      title: "Type",
      sortable: true,
      width: 100,
      render: ({ type }) => <TransactionTypeBadge type={type} />,
    },
    {
      accessor: "quantity",
      title: "Quantity",
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
          <Text fw={600} c={negative ? "red.7" : "teal.7"}>
            {signed}
          </Text>
        );
      },
    },
    {
      accessor: "balance_after",
      title: "Balance",
      textAlign: "right",
      width: 100,
      render: ({ balance_after }) => <Text fw={700}>{balance_after}</Text>,
    },
    {
      accessor: "created_by_name",
      title: "By",
      width: 160,
      render: ({ created_by_name }) => (
        <Text fz="sm" c="dimmed">
          {created_by_name}
        </Text>
      ),
    },
    {
      accessor: "note",
      title: "Note/Reason",
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
      entityName="transactions"
      fetching={isLoading}
      isLoadingInitial={isLoadingInitial}
    />
  );
};
