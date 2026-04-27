import { PageLayout } from "@/components/Layouts/Page";
import {
  Stack,
  Text,
  Title,
  Group,
  Button,
  Paper,
  ActionIcon,
  Table,
  Divider,
  Grid,
  Badge,
} from "@mantine/core";
import { ArrowLeft, Check, Package, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PurchaseOrderService } from "@/services/PurchaseOrderService";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { formatDate } from "@/utils/DateUtil";
import { PurchaseOrderStatusBadge } from "@/components/Badges/PurchaseOrderStatusBadge";
import { modals } from "@mantine/modals";
import { $authUser } from "@/stores/authUserStore";
import { useStore } from "@nanostores/react";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";

export const PurchaseOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useStore($authUser);

  const { order, isLoadingInitialData, reloadOrder } = useLoadInitialData({
    id,
  });

  const handleUpdateStatus = async (newStatus: PurchaseOrderStatus) => {
    if (!order) return;

    const confirmAction = () => {
      modals.openConfirmModal({
        title: `Confirm Status Change: ${newStatus}`,
        centered: true,
        children: (
          <Text size="sm">
            Are you sure you want to change status to{" "}
            <strong>{newStatus}</strong>?
            {newStatus === "RECEIVED" && (
              <Text c="red.6" fw={600} mt="sm">
                This will automatically increase stock levels for all items in
                this order.
              </Text>
            )}
          </Text>
        ),
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onConfirm: async () => {
          setIsUpdating(true);
          const response = await PurchaseOrderService.updateStatus(
            order.purchase_order_id,
            { status: newStatus, updated_by: authUser?.user_id || "" },
          );
          if (response.ok) {
            await reloadOrder();
          } else {
            NotificationUtil.notifyError({
              title: "Failed to update status",
              message: response.message,
            });
          }
          setIsUpdating(false);
        },
      });
    };

    confirmAction();
  };

  const canConfirm = order?.status === "DRAFT";
  const canReceive = order?.status === "CONFIRMED";
  const canCancel = order?.status === "DRAFT" || order?.status === "CONFIRMED";

  return (
    <PageLayout
      isLoading={isLoadingInitialData}
      breadcrumbs={{ label: order?.purchase_order_id ?? "Detail" }}
    >
      {order && (
          <Stack gap="lg">
            <Group justify="space-between">
              <Group gap="sm">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={20} />
                </ActionIcon>
                <Stack gap={0}>
                  <Group gap="xs">
                    <Title order={2} fw={700}>
                      {order.purchase_order_id}
                    </Title>
                    <PurchaseOrderStatusBadge status={order.status} />
                  </Group>
                  <Text c="gray.6" fz="sm">
                    Created on {formatDate(order.created_at)} by{" "}
                    {order.created_by_name}
                  </Text>
                </Stack>
              </Group>

              <Group>
                {canCancel && (
                  <Button
                    variant="outline"
                    color="red"
                    leftSection={<X size={18} />}
                    onClick={() => handleUpdateStatus("CANCELLED")}
                    loading={isUpdating}
                  >
                    Cancel PO
                  </Button>
                )}
                {canConfirm && (
                  <Button
                    leftSection={<Check size={18} />}
                    onClick={() => handleUpdateStatus("CONFIRMED")}
                    loading={isUpdating}
                  >
                    Confirm Order
                  </Button>
                )}
                {canReceive && (
                  <Button
                    color="green"
                    leftSection={<Package size={18} />}
                    onClick={() => handleUpdateStatus("RECEIVED")}
                    loading={isUpdating}
                  >
                    Receive Stock
                  </Button>
                )}
              </Group>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder radius="md">
                  <Table verticalSpacing="md">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Product</Table.Th>
                        <Table.Th w={100} ta="center">
                          Quantity
                        </Table.Th>
                        <Table.Th w={150} ta="right">
                          Unit Price
                        </Table.Th>
                        <Table.Th w={150} ta="right">
                          Subtotal
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {order.items.map((item) => (
                        <Table.Tr key={item.purchase_order_item_id}>
                          <Table.Td>
                            <Text fw={500}>{item.product_name}</Text>
                            <Text size="xs" c="gray.6">
                              {item.product_id}
                            </Text>
                          </Table.Td>
                          <Table.Td align="center">{item.quantity}</Table.Td>
                          <Table.Td align="right">
                            {formatCurrency(item.unit_price)}
                          </Table.Td>
                          <Table.Td align="right" fw={600}>
                            {formatCurrency(item.subtotal)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                  <Divider />
                  <Group justify="flex-end" p="md">
                    <Stack gap={4} align="flex-end">
                      <Group gap="xl">
                        <Text fw={600} size="lg">
                          Total Amount:
                        </Text>
                        <Text fw={700} size="xl" c="blue.7">
                          {formatCurrency(order.total_amount)}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="md">
                  <Paper withBorder p="md" radius="md">
                    <Title order={4} mb="sm">
                      Supplier Information
                    </Title>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm" c="gray.6">
                          Name:
                        </Text>
                        <Text size="sm" fw={500}>
                          {order.supplier_name}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="gray.6">
                          ID:
                        </Text>
                        <Text size="sm" fw={500}>
                          {order.supplier_id}
                        </Text>
                      </Group>
                    </Stack>
                  </Paper>

                  <Paper withBorder p="md" radius="md" bg="gray.0">
                    <Title order={4} mb="sm">
                      Order Timeline
                    </Title>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Badge variant="dot" size="sm">
                          Created
                        </Badge>
                        <Text size="xs">{formatDate(order.created_at)}</Text>
                      </Group>
                      {order.status === "CONFIRMED" && (
                        <Group gap="xs">
                          <Badge color="blue" variant="dot" size="sm">
                            Confirmed
                          </Badge>
                          <Text size="xs">Awaiting delivery</Text>
                        </Group>
                      )}
                      {order.status === "RECEIVED" && (
                        <Group gap="xs">
                          <Badge color="green" variant="dot" size="sm">
                            Received
                          </Badge>
                          <Text size="xs">Stock updated</Text>
                        </Group>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
        </Stack>
      )}
    </PageLayout>
  );
};
