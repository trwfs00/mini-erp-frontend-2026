import { InstantTable } from "@/components/instant-table";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/use-pagination-state";
import type { UseTableSortReturn } from "@/hooks/table/use-table-sort";
import type { ProductList } from "@/types/product/product-list";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/date-util";
import { formatCurrency } from "@/utils/currency-util";

type Props = {
  records: ProductList[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
};

export const ProductListTable = ({
  records,
  pagination,
  sortHandler,
}: Props) => {
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
  ];

  return (
    <InstantTable<ProductList>
      idAccessor="product_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName="products"
    />
  );
};
