import { SimpleGrid, Stack, Text, ThemeIcon } from "@mantine/core";
import { SurfaceCard } from "@/components/SurfaceCard";
import { formatCurrency } from "@/utils/CurrencyUtil";
import type { DashboardSummary } from "@/types/dashboard/DashboardStats";
import {
  Package,
  Wallet,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  PackageCheck,
} from "lucide-react";
import type { FC, ReactNode } from "react";

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
      <Text fz="xs" c="gray.6" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text fz="xl" fw={700} c="gray.9">
        {value}
      </Text>
    </Stack>
  </SurfaceCard>
);

type Props = {
  summary: DashboardSummary;
};

export const SummaryCards: FC<Props> = ({ summary }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      <Card
        label="Total Products"
        value={summary.total_products.toLocaleString()}
        icon={<Package size={18} />}
        accent="blue"
      />
      <Card
        label="Stock Value (Cost)"
        value={formatCurrency(summary.total_stock_value)}
        icon={<Wallet size={18} />}
        accent="teal"
      />
      <Card
        label="Stock Value (Selling)"
        value={formatCurrency(summary.total_selling_value)}
        icon={<TrendingUp size={18} />}
        accent="green"
      />
      <Card
        label="Low Stock"
        value={`${summary.low_stock_count} items`}
        icon={<AlertTriangle size={18} />}
        accent="red"
      />
      <Card
        label="Pending POs"
        value={summary.pending_po_count.toLocaleString()}
        icon={<ClipboardList size={18} />}
        accent="orange"
      />
      <Card
        label="Received This Month"
        value={summary.received_po_this_month.toLocaleString()}
        icon={<PackageCheck size={18} />}
        accent="grape"
      />
    </SimpleGrid>
  );
};
