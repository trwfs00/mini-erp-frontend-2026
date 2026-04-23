import type { FC } from "react";
import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { StockTransaction } from "@/types/stock/StockTransaction";
import { Badge, Text, Group } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import dayjs from "dayjs";

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
      render: ({ type }) => {
        const color = type === "IN" ? "green" : type === "OUT" ? "red" : "blue";
        return (
          <Badge color={color} variant="light">
            {type}
          </Badge>
        );
      },
    },
    {
      accessor: "quantity",
      title: "Quantity",
      sortable: true,
      textAlign: "right",
      width: 100,
      render: ({ quantity, type }) => (
        <Text fw={600} c={type === "OUT" ? "red.7" : "gray.9"}>
          {type === "OUT" ? `-${quantity}` : `+${quantity}`}
        </Text>
      ),
    },
    {
      accessor: "balance_after",
      title: "Balance",
      textAlign: "right",
      width: 100,
      render: ({ balance_after }) => <Text fw={700}>{balance_after}</Text>,
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
    />
  );
};
