import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { ProductList } from "@/types/product/ProductList";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/DateUtil";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { ActionIcon, Group, Text } from "@mantine/core";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tProductList } from "@/consts/translations/tProductList";

type Props = {
  records: ProductList[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  onEdit?: (product: ProductList) => void;
  onDelete?: (product: ProductList) => void;
  isLoading?: boolean;
  isLoadingInitial?: boolean;
};

export const ProductListTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  onEdit,
  onDelete,
  isLoading,
  isLoadingInitial,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<ProductList>[] = [
    { accessor: "sku", title: t(tProductList.thead.sku), sortable: true, width: 120 },
    { accessor: "name", title: t(tProductList.thead.name), sortable: true },
    {
      accessor: "category_name",
      title: t(tProductList.thead.category),
      sortable: true,
      width: 130,
    },
    {
      accessor: "cost_price",
      title: t(tProductList.thead.cost),
      sortable: true,
      width: 120,
      textAlign: "right",
      render: (p) => formatCurrency(p.cost_price),
    },
    {
      accessor: "selling_price",
      title: t(tProductList.thead.price),
      sortable: true,
      width: 120,
      textAlign: "right",
      render: (p) => formatCurrency(p.selling_price),
    },
    { accessor: "unit", title: t(tProductList.thead.unit), width: 80 },
    {
      accessor: "current_stock",
      title: t(tProductList.thead.stock),
      sortable: true,
      width: 100,
      textAlign: "right",
      render: (p) => {
        const isLowStock = p.current_stock <= p.min_stock;
        return (
          <Group gap={4} justify="flex-end">
            {isLowStock && <AlertTriangle size={14} color="var(--mantine-color-red-6)" />}
            <Text fw={isLowStock ? 700 : 400} c={isLowStock ? "red.6" : "inherit"}>
              {p.current_stock}
            </Text>
          </Group>
        );
      },
    },
    {
      accessor: "min_stock",
      title: t(tProductList.thead.minStock),
      sortable: true,
      width: 110,
      textAlign: "right",
    },
    {
      accessor: "updated_at",
      title: t(tProductList.thead.updated),
      sortable: true,
      width: 140,
      render: (p) => formatDate(p.updated_at),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      accessor: "actions",
      title: t(tProductList.thead.actions),
      width: 100,
      textAlign: "center",
      render: (p) => (
        <Group gap={8} justify="center">
          {onEdit && (
            <ActionIcon
              variant="subtle"
             
              onClick={(e) => {
                e.stopPropagation();
                onEdit(p);
              }}
            >
              <Edit size={16} />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(p);
              }}
            >
              <Trash2 size={16} />
            </ActionIcon>
          )}
        </Group>
      ),
    });
  }

  return (
    <InstantTable<ProductList>
      idAccessor="product_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={tProductList.product}
      fetching={isLoading}
      isLoadingInitial={isLoadingInitial}
    />
  );
};
