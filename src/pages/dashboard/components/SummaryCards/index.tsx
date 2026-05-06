import { SimpleGrid, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { SurfaceCard } from "@/components/SurfaceCard";
import { formatCurrency } from "@/utils/CurrencyUtil";
import type { DashboardSummary } from "@/types/dashboard/DashboardDetail";
import {
  Package,
  Wallet,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  PackageCheck,
} from "lucide-react";
import type { FC, ReactNode } from "react";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tDashboard } from "@/consts/translations/tDashboard";

type CardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
};

const Card: FC<CardProps> = ({ label, value, icon, accent }) => (
  <SurfaceCard>
    <Stack gap="xs">
      <ThemeIcon variant="light" color={accent} size="lg" radius="md">
        {icon}
      </ThemeIcon>
      <Text fz="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text fz="xl" fw={700}>
        {value}
      </Text>
    </Stack>
  </SurfaceCard>
);

type Props = {
  summary: DashboardSummary | null;
  isLoading?: boolean;
};

const TileSkeleton: FC = () => (
  <SurfaceCard>
    <Stack gap="xs">
      <Skeleton height={28} width={28} radius="md" />
      <Skeleton height={10} width="60%" radius="sm" mt={4} />
      <Skeleton height={22} width="80%" radius="sm" />
    </Stack>
  </SurfaceCard>
);

export const SummaryCards: FC<Props> = ({ summary, isLoading }) => {
  const t = useTranslation();

  if (isLoading || !summary) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <TileSkeleton key={i} />
        ))}
      </SimpleGrid>
    );
  }


  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      <Card
        label={t(tDashboard.summary.totalProducts)}
        value={summary.total_products.toLocaleString()}
        icon={<Package size={18} />}
        accent="blue"
      />
      <Card
        label={t(tDashboard.summary.stockValueCost)}
        value={formatCurrency(summary.total_stock_value)}
        icon={<Wallet size={18} />}
        accent="teal"
      />
      <Card
        label={t(tDashboard.summary.stockValueSelling)}
        value={formatCurrency(summary.total_selling_value)}
        icon={<TrendingUp size={18} />}
        accent="green"
      />
      <Card
        label={t(tDashboard.summary.lowStock)}
        value={`${summary.low_stock_count} ${t(tDashboard.lowStockList.units)}`}
        icon={<AlertTriangle size={18} />}
        accent="red"
      />
      <Card
        label={t(tDashboard.summary.pendingPOs)}
        value={summary.pending_po_count.toLocaleString()}
        icon={<ClipboardList size={18} />}
        accent="orange"
      />
      <Card
        label={t(tDashboard.summary.receivedThisMonth)}
        value={summary.received_po_this_month.toLocaleString()}
        icon={<PackageCheck size={18} />}
        accent="grape"
      />
    </SimpleGrid>
  );
};
