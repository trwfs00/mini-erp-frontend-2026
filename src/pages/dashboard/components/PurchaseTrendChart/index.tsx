import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tDashboard } from "@/consts/translations/tDashboard";

type Props = {
  data: PurchaseTrendPoint[];
  isLoading?: boolean;
};

export const PurchaseTrendChart: FC<Props> = ({ data, isLoading }) => {
  const t = useTranslation();
  const labelAmount = t(tDashboard.purchaseTrendChart.seriesAmount);
  const chartData = data.map((d) => ({
    month: d.month.slice(5),
    [labelAmount]: d.total_amount,
  }));

  return (
    <SurfaceCard>
      <Stack gap="sm">
        <Stack gap={2}>
          <Title order={4} fw={600} c="gray.9">
            {t(tDashboard.purchaseTrendChart.title)}
          </Title>
          <Text fz="xs" c="gray.6">
            {t(tDashboard.purchaseTrendChart.subtitle)}
          </Text>
        </Stack>
        {isLoading ? (
          <Skeleton h={260} radius="sm" />
        ) : chartData.length === 0 ? (
          <Text c="gray.5" fz="sm" ta="center" py="xl">
            {t(tDashboard.purchaseTrendChart.empty)}
          </Text>
        ) : (
          <LineChart
            h={260}
            data={chartData}
            dataKey="month"
            series={[{ name: labelAmount, color: "indigo.6" }]}
            curveType="monotone"
            withDots
            withLegend
          />
        )}
      </Stack>
    </SurfaceCard>
  );
};
