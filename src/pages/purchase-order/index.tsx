import { PageLayout } from "@/components/Layouts/Page";
import {
  Stack,
  Text,
  Title,
  Group,
  TextInput,
  Button,
  Select,
} from "@mantine/core";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { useDebouncedValue } from "@mantine/hooks";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { PurchaseOrderTable } from "@/components/Tables/PurchaseOrderTable";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/router/routePaths";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";

export const PurchaseOrderPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | "ALL">(
    "ALL",
  );
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const navigate = useNavigate();

  const pagination = usePaginationState();
  const sortHandler = useTableSort("created_at", "desc");

  const { orders, isLoadingInitialData, isReloading, reloadOrders } =
    useLoadInitialData({
      search: debouncedSearch,
      statusFilter,
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sortHandler.sortBy,
      orderBy: sortHandler.orderBy,
      setTotalPage: pagination.setTotalPage,
      setTotalCount: pagination.setTotalCount,
      setPage: pagination.setPage,
    });

  return (
    <PageLayout
      isLoading={isLoadingInitialData}
      breadcrumbs={{
        label: "Purchase Orders",
        path: ROUTE_PATHS.PURCHASE_ORDERS,
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              Purchase Orders
            </Title>
            <Text c="gray.6" fz="sm">
              Create and track your inventory purchase orders.
            </Text>
          </Stack>

          <Group>
            <TextInput
              placeholder="Search by ID or Supplier..."
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 250 }}
            />
            <Select
              placeholder="Status"
              data={[
                { value: "ALL", label: "All Status" },
                { value: "DRAFT", label: "Draft" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "RECEIVED", label: "Received" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
              value={statusFilter}
              onChange={(val) =>
                setStatusFilter((val as PurchaseOrderStatus | "ALL") ?? "ALL")
              }
              w={150}
            />
            <RefreshButton onClick={async () => await reloadOrders()} />
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => navigate(ROUTE_PATHS.PO_CREATE)}
            >
              Create PO
            </Button>
          </Group>
        </Group>

        <PurchaseOrderTable
          records={orders}
          pagination={pagination}
          sortHandler={sortHandler}
          onView={(id: string) => {
            navigate(ROUTE_PATHS.PO_DETAIL.replace(":id", id));
          }}
          isLoading={isReloading}
        />
      </Stack>
    </PageLayout>
  );
};
