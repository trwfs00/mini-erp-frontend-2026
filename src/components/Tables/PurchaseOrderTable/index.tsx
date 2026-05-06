import { InstantTable } from "@/components/InstantTable";
import type { PurchaseOrderSummary } from "@/types/purchase-order/PurchaseOrder";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/DateUtil";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { ActionIcon, Group, Text } from "@mantine/core";
import { Eye } from "lucide-react";
import type { FC } from "react";
import { PurchaseOrderStatusBadge } from "@/components/Badges/PurchaseOrderStatusBadge";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tPurchaseOrder } from "@/consts/translations/tPurchaseOrder";

type Props = {
  records: PurchaseOrderSummary[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  onView: (id: string) => void;
  isLoading?: boolean;
  isLoadingInitial?: boolean;
};

export const PurchaseOrderTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  onView,
  isLoading,
  isLoadingInitial,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<PurchaseOrderSummary>[] = [
    {
      accessor: "purchase_order_id",
      title: t(tPurchaseOrder.thead.poNumber),
      sortable: true,
      width: 150,
      render: (p) => <Text fw={500}>{p.purchase_order_id}</Text>,
    },
    {
      accessor: "supplier_name",
      title: t(tPurchaseOrder.thead.supplier),
      sortable: true,
    },
    {
      accessor: "status",
      title: t(tPurchaseOrder.thead.status),
      sortable: true,
      width: 120,
      render: (p) => <PurchaseOrderStatusBadge status={p.status} />,
    },
    {
      accessor: "total_amount",
      title: t(tPurchaseOrder.thead.totalAmount),
      sortable: true,
      width: 150,
      textAlign: "right",
      render: (p) => formatCurrency(p.total_amount),
    },
    {
      accessor: "item_count",
      title: t(tPurchaseOrder.thead.items),
      width: 80,
      textAlign: "center",
    },
    {
      accessor: "created_at",
      title: t(tPurchaseOrder.thead.created),
      sortable: true,
      width: 160,
      render: (p) => formatDate(p.created_at),
    },
    {
      accessor: "created_by_name",
      title: t(tPurchaseOrder.thead.createdBy),
      width: 150,
    },
    {
      accessor: "actions",
      title: t(tPurchaseOrder.thead.actions),
      width: 80,
      textAlign: "center",
      render: (p) => (
        <Group gap={8} justify="center">
          <ActionIcon
            variant="subtle"
           
            onClick={(e) => {
              e.stopPropagation();
              onView(p.purchase_order_id);
            }}
          >
            <Eye size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <InstantTable<PurchaseOrderSummary>
      idAccessor="purchase_order_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={tPurchaseOrder.purchaseOrder}
      fetching={isLoading}
      isLoadingInitial={isLoadingInitial}
      onRowClick={({ record }) => onView(record.purchase_order_id)}
    />
  );
};
