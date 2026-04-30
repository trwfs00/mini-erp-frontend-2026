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
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tReport } from "@/consts/translations/tReport";
import { tPurchaseOrder } from "@/consts/translations/tPurchaseOrder";

type Props = {
  records: PurchaseSummaryRow[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  isLoading?: boolean;
};

export const PurchaseSummaryReportTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  isLoading,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<PurchaseSummaryRow>[] = [
    {
      accessor: "purchase_order_id",
      title: t(tReport.purchaseSummary.thead.poId),
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
      title: t(tReport.purchaseSummary.thead.supplier),
      sortable: true,
      render: (r) => <Text fz="sm">{r.supplier_name}</Text>,
    },
    {
      accessor: "status",
      title: t(tReport.purchaseSummary.thead.status),
      sortable: true,
      width: 120,
      render: (r) => <PurchaseOrderStatusBadge status={r.status} />,
    },
    {
      accessor: "item_count",
      title: t(tReport.purchaseSummary.thead.items),
      sortable: true,
      textAlign: "right",
      width: 90,
    },
    {
      accessor: "total_amount",
      title: t(tReport.purchaseSummary.thead.total),
      sortable: true,
      textAlign: "right",
      width: 140,
      render: (r) => formatCurrency(r.total_amount),
    },
    {
      accessor: "created_at",
      title: t(tReport.purchaseSummary.thead.created),
      sortable: true,
      width: 140,
      render: (r) => (
        <Text fz="sm" c="gray.6">
          {formatDate(r.created_at)}
        </Text>
      ),
    },
    {
      accessor: "created_by_name",
      title: t(tReport.purchaseSummary.thead.by),
      width: 160,
      render: (r) => (
        <Text fz="sm" c="gray.6">
          {r.created_by_name}
        </Text>
      ),
    },
  ];

  return (
    <InstantTable<PurchaseSummaryRow>
      idAccessor="purchase_order_id"
      columns={columns}
      records={records}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={tPurchaseOrder.purchaseOrder}
      fetching={isLoading}
    />
  );
};
