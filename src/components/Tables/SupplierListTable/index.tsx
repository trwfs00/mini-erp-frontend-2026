import { InstantTable } from "@/components/InstantTable";
import type { UsePaginationStateReturnType } from "@/hooks/pagination/usePaginationState";
import type { UseTableSortReturn } from "@/hooks/table/useTableSort";
import type { SupplierList } from "@/types/supplier/SupplierList";
import type { DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/DateUtil";
import { ActionIcon, Group, Text, Stack } from "@mantine/core";
import { Edit, Trash2, Mail, Phone } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tSupplierList } from "@/consts/translations/tSupplierList";

type Props = {
  records: SupplierList[];
  pagination: UsePaginationStateReturnType;
  sortHandler: UseTableSortReturn;
  onEdit?: (supplier: SupplierList) => void;
  onDelete?: (supplier: SupplierList) => void;
  isLoading?: boolean;
};

export const SupplierListTable: FC<Props> = ({
  records,
  pagination,
  sortHandler,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const t = useTranslation();
  const columns: DataTableColumn<SupplierList>[] = [
    {
      accessor: "name",
      title: t(tSupplierList.thead.info),
      sortable: true,
      render: (s) => (
        <Stack gap={4}>
          <Text size="sm" fw={600}>
            {s.name}
          </Text>
          <Text size="xs" c="dimmed">
            {s.supplier_id}
          </Text>
        </Stack>
      ),
    },
    {
      accessor: "contact",
      title: t(tSupplierList.thead.contact),
      render: (s) => (
        <Stack gap={2}>
          <Group gap={6}>
            <Phone size={12} color="var(--mantine-color-blue-6)" />
            <Text size="xs">{s.phone}</Text>
          </Group>
          <Group gap={6}>
            <Mail size={12} color="var(--mantine-color-teal-6)" />
            <Text size="xs">{s.email}</Text>
          </Group>
        </Stack>
      ),
    },
    {
      accessor: "address",
      title: t(tSupplierList.thead.address),
      render: (s) => (
        <Text size="xs" lineClamp={2}>
          {s.address}
        </Text>
      ),
    },
    {
      accessor: "updated_at",
      title: t(tSupplierList.thead.updated),
      sortable: true,
      width: 140,
      render: (s) => formatDate(s.updated_at),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      accessor: "actions",
      title: t(tSupplierList.thead.actions),
      width: 100,
      textAlign: "center",
      render: (s) => (
        <Group gap={8} justify="center">
          {onEdit && (
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(s);
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
                onDelete(s);
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
    <InstantTable<SupplierList>
      idAccessor="supplier_id"
      records={records}
      columns={columns}
      pagination={pagination}
      sortHandler={sortHandler}
      entityName={tSupplierList.supplier}
      fetching={isLoading}
    />
  );
};
