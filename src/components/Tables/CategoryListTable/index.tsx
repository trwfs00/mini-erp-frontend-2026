import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { CategoryList } from "@/types/category/CategoryList";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/DateUtil";
import { ActionIcon, Group } from "@mantine/core";
import { Edit, Trash2 } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tCategoryList } from "@/consts/translations/tCategoryList";

type Props = {
  records: CategoryList[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  onEdit?: (category: CategoryList) => void;
  onDelete?: (category: CategoryList) => void;
  isLoading?: boolean;
};

export const CategoryListTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<CategoryList>[] = [
    {
      accessor: "category_id",
      title: t(tCategoryList.thead.id),
      sortable: true,
      width: 130,
    },
    {
      accessor: "name",
      title: t(tCategoryList.thead.name),
      sortable: true,
    },
    {
      accessor: "description",
      title: t(tCategoryList.thead.description),
    },
    {
      accessor: "updated_at",
      title: t(tCategoryList.thead.updated),
      sortable: true,
      width: 140,
      render: (c) => formatDate(c.updated_at),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      accessor: "actions",
      title: t(tCategoryList.thead.actions),
      width: 100,
      textAlign: "center",
      render: (c) => (
        <Group gap={8} justify="center">
          {onEdit && (
            <ActionIcon
              variant="subtle"
              color="blue"
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
      entityName={tCategoryList.category}
      fetching={isLoading}
    />
  );
};
