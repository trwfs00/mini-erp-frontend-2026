import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { CategoryList } from "@/types/category/CategoryList";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/DateUtil";
import { ActionIcon, Group } from "@mantine/core";
import { Edit, Trash2 } from "lucide-react";
import type { FC } from "react";

type Props = {
  records: CategoryList[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  onEdit?: (category: CategoryList) => void;
  onDelete?: (category: CategoryList) => void;
  isLoading?: boolean;
  isLoadingInitial?: boolean;
};

export const CategoryListTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  onEdit,
  onDelete,
  isLoading,
  isLoadingInitial,
}) => {
  const columns: DataTableColumn<CategoryList>[] = [
    {
      accessor: "name",
      title: "Category Name",
      sortable: true,
      width: 280,
    },
    {
      accessor: "description",
      title: "Description",
      ellipsis: true,
    },
    {
      accessor: "updated_at",
      title: "Updated",
      sortable: true,
      width: 140,
      render: (c) => formatDate(c.updated_at),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      accessor: "actions",
      title: "Actions",
      width: 100,
      textAlign: "center",
      render: (c) => (
        <Group gap={8} justify="center">
          {onEdit && (
            <ActionIcon
              variant="subtle"
             
              onClick={(e) => {
                e.stopPropagation();
                onEdit(c);
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
                onDelete(c);
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
    <InstantTable<CategoryList>
      idAccessor="category_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName="categories"
      fetching={isLoading}
      isLoadingInitial={isLoadingInitial}
    />
  );
};
