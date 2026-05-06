import {
  Badge,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AlertTriangle, PackageCheck } from "lucide-react";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { LowStockProduct } from "@/types/dashboard/DashboardDetail";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tDashboard } from "@/consts/translations/tDashboard";

type Props = {
  products: LowStockProduct[];
  isLoading?: boolean;
};

const LIST_MAX_HEIGHT = 260;

const LowStockRow: FC<{ product: LowStockProduct }> = ({ product }) => {
  const t = useTranslation();
  return (
    <Group justify="space-between" wrap="nowrap" gap="sm" py={6}>
      <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
        <Text fz="sm" fw={500} truncate>
          {product.name}
        </Text>
        <Text fz="xs" c="dimmed" truncate>
          {product.sku}
        </Text>
      </Stack>
      <Stack gap={0} align="flex-end" style={{ flexShrink: 0 }}>
        <Text fz="sm" fw={700} c="red.7">
          {product.current_stock} {product.unit}
        </Text>
        <Text fz="xs" c="dimmed">
          {t(tDashboard.lowStockList.minStock)} {product.min_stock}
        </Text>
      </Stack>
    </Group>
  );
};

export const LowStockWarningList: FC<Props> = ({ products, isLoading }) => {
  const t = useTranslation();
  const renderBody = () => {
    if (isLoading) {
      return (
        <Stack gap="sm" h={LIST_MAX_HEIGHT}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} h={42} radius="sm" />
          ))}
        </Stack>
      );
    }

    if (products.length === 0) {
      return (
        <Stack align="center" justify="center" gap={8} h={LIST_MAX_HEIGHT}>
          <PackageCheck
            size={32}
            color="var(--mantine-color-green-6)"
            strokeWidth={1.5}
          />
          <Text fz="sm" c="dimmed" ta="center">
            {t(tDashboard.lowStockList.empty)}
          </Text>
        </Stack>
      );
    }

    return (
      <ScrollArea h={LIST_MAX_HEIGHT} type="hover" scrollbarSize={6}>
        <Stack gap={0} pr="xs">
          {products.map((p, i) => (
            <div key={p.product_id}>
              {i > 0 && (
                <div
                  style={{
                    borderTop:
                      "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
                  }}
                />
              )}
              <LowStockRow product={p} />
            </div>
          ))}
        </Stack>
      </ScrollArea>
    );
  };

  return (
    <SurfaceCard h="100%">
      <Stack gap="sm">
        <Group gap="xs" justify="space-between">
          <Group gap="xs">
            <AlertTriangle size={18} color="var(--mantine-color-red-6)" />
            <Title order={5} fw={600}>
              {t(tDashboard.lowStockList.title)}
            </Title>
          </Group>
          {products.length > 0 && (
            <Badge color="red" variant="light" radius="sm">
              {products.length}
            </Badge>
          )}
        </Group>

        {renderBody()}
      </Stack>
    </SurfaceCard>
  );
};
