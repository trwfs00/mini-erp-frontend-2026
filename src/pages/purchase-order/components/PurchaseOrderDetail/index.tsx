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
import { tMenu } from "@/consts/translations/tMenu";
import { tBasic } from "@/consts/translations/tBasic";
import { tPurchaseOrder } from "@/consts/translations/tPurchaseOrder";
import { useTranslation } from "@/hooks/translation/useTranslation";
import type { PurchaseOrderStatus } from "@/types/purchase-order/PurchaseOrder";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { formatDate } from "@/utils/DateUtil";
import { PurchaseOrderStatusBadge } from "@/components/Badges/PurchaseOrderStatusBadge";
import { PO_STATUS_LABELS } from "@/consts/poStatusLabels";
import { modals } from "@mantine/modals";
import { $authUser } from "@/stores/authUserStore";
import { useStore } from "@nanostores/react";
import { NotificationUtil } from "@/utils/NotificationUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { PurchaseOrderDetailSkeleton } from "./components/PurchaseOrderDetailSkeleton";

export const PurchaseOrderDetailPage = () => {
  const t = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useStore($authUser);

  const { order, isLoadingInitialData, reloadOrder } = useLoadInitialData({
    id,
  });

  const handleUpdateStatus = async (newStatus: PurchaseOrderStatus) => {
    if (!order) return;

    const statusLabel = t(PO_STATUS_LABELS[newStatus]);

    modals.openConfirmModal({
      title: t(tPurchaseOrder.detail.confirmStatusTitle(statusLabel)),
      centered: true,
      children: (
        <Text size="sm">
          {t(tPurchaseOrder.detail.confirmStatusMessage(statusLabel))}
          {newStatus === "RECEIVED" && (
            <Text c="red.6" fw={600} mt="sm">
              {t(tPurchaseOrder.detail.receivedWarning)}
            </Text>
          )}
        </Text>
      ),
      labels: { confirm: t(tBasic.textConfirm), cancel: t(tBasic.textCancel) },
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
            title: t(tPurchaseOrder.detail.notifyUpdateError),
            message: response.message,
          });
        }
        setIsUpdating(false);
      },
    });
  };

  const canConfirm = order?.status === "DRAFT";
  const canReceive = order?.status === "CONFIRMED";
  const canCancel = order?.status === "DRAFT" || order?.status === "CONFIRMED";

  return (
    <PageLayout
      breadcrumbs={{
        label: order?.purchase_order_id
          ? { th: order.purchase_order_id, en: order.purchase_order_id }
          : tMenu.detail,
      }}
    >
      {isLoadingInitialData && (
        <PurchaseOrderDetailSkeleton onBack={() => navigate(-1)} />
      )}
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
                <Text c="dimmed" fz="sm">
                  {t(
                    tPurchaseOrder.detail.createdOnBy(
                      formatDate(order.created_at),
                      order.created_by_name,
                    ),
                  )}
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
                  {t(tPurchaseOrder.detail.cancelButton)}
                </Button>
              )}
              {canConfirm && (
                <Button
                  leftSection={<Check size={18} />}
                  onClick={() => handleUpdateStatus("CONFIRMED")}
                  loading={isUpdating}
                >
                  {t(tPurchaseOrder.detail.confirmButton)}
                </Button>
              )}
              {canReceive && (
                <Button
                  color="green"
                  leftSection={<Package size={18} />}
                  onClick={() => handleUpdateStatus("RECEIVED")}
                  loading={isUpdating}
                >
                  {t(tPurchaseOrder.detail.receiveButton)}
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
                      <Table.Th>{t(tPurchaseOrder.thead.product)}</Table.Th>
                      <Table.Th w={100} ta="center">
                        {t(tPurchaseOrder.thead.quantity)}
                      </Table.Th>
                      <Table.Th w={150} ta="right">
                        {t(tPurchaseOrder.thead.unitPrice)}
                      </Table.Th>
                      <Table.Th w={150} ta="right">
                        {t(tPurchaseOrder.thead.subtotal)}
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {order.items.map((item) => (
                      <Table.Tr key={item.purchase_order_item_id}>
                        <Table.Td>
                          <Text fw={500}>{item.product_name}</Text>
                          <Text size="xs" c="dimmed">
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
                        {t(tPurchaseOrder.create.totalAmount)}:
                      </Text>
                      <Text
                        fw={700}
                        size="xl"
                        c="var(--mantine-primary-color-filled)"
                      >
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
                    {t(tPurchaseOrder.detail.supplierInfo)}
                  </Title>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        {t(tPurchaseOrder.detail.name)}:
                      </Text>
                      <Text size="sm" fw={500}>
                        {order.supplier_name}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        {t(tPurchaseOrder.detail.id)}:
                      </Text>
                      <Text size="sm" fw={500}>
                        {order.supplier_id}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>

                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
                >
                  <Title order={4} mb="sm">
                    {t(tPurchaseOrder.detail.timeline)}
                  </Title>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <Badge variant="dot" size="sm">
                        {t(tPurchaseOrder.detail.timelineCreated)}
                      </Badge>
                      <Text size="xs">{formatDate(order.created_at)}</Text>
                    </Group>
                    {order.status === "CONFIRMED" && (
                      <Group gap="xs">
                        <Badge color="blue" variant="dot" size="sm">
                          {t(tPurchaseOrder.detail.timelineConfirmed)}
                        </Badge>
                        <Text size="xs">
                          {t(tPurchaseOrder.detail.timelineAwaiting)}
                        </Text>
                      </Group>
                    )}
                    {order.status === "RECEIVED" && (
                      <Group gap="xs">
                        <Badge color="green" variant="dot" size="sm">
                          {t(tPurchaseOrder.detail.timelineReceived)}
                        </Badge>
                        <Text size="xs">
                          {t(tPurchaseOrder.detail.timelineStockUpdated)}
                        </Text>
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
