import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { ProductList } from "@/types/product/ProductList";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/DateUtil";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { ActionIcon, Group } from "@mantine/core";
import { Edit, Trash2 } from "lucide-react";
import type { FC } from "react";

type Props = {
  records: ProductList[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  onEdit: (product: ProductList) => void;
  onDelete: (product: ProductList) => void;
  isLoading?: boolean;
};

export const ProductListTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const columns: DataTableColumn<ProductList>[] = [
    { accessor: "sku", title: "SKU", sortable: true, width: 120 },
    { accessor: "name", title: "Product Name", sortable: true },
    { accessor: "category_id", title: "Category", sortable: true, width: 130 },
    {
      accessor: "cost_price",
      title: "Cost",
      sortable: true,
      width: 120,
      textAlign: "right",
      render: (p) => formatCurrency(p.cost_price),
    },
    {
      accessor: "selling_price",
      title: "Price",
      sortable: true,
      width: 120,
      textAlign: "right",
      render: (p) => formatCurrency(p.selling_price),
    },
    { accessor: "unit", title: "Unit", width: 100 },
    {
      accessor: "min_stock",
      title: "Min Stock",
      sortable: true,
      width: 110,
      textAlign: "right",
    },
    {
      accessor: "updated_at",
      title: "Updated",
      sortable: true,
      width: 140,
      render: (p) => formatDate(p.updated_at),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      textAlign: "center",
      render: (p) => (
        <Group gap={8} justify="center">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(p);
            }}
          >
            <Edit size={16} />
          </ActionIcon>
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
        </Group>
      ),
    },
  ];

  return (
    <InstantTable<ProductList>
      idAccessor="product_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName="products"
      fetching={isLoading}
    />
  );
};
