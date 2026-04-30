import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tDashboard } from "@/consts/translations/tDashboard";

type Props = {
  data: StockMovementDailyPoint[];
  isLoading?: boolean;
};

export const StockMovementChart: FC<Props> = ({ data, isLoading }) => {
  const t = useTranslation();
  const labelIn = t(tDashboard.stockMovementChart.seriesIn);
  const labelOut = t(tDashboard.stockMovementChart.seriesOut);
  const labelAdjust = t(tDashboard.stockMovementChart.seriesAdjust);
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    [labelIn]: d.in,
    [labelOut]: d.out,
    [labelAdjust]: d.adjust,
  }));

  return (
    <SurfaceCard h="100%">
      <Stack gap="sm">
        <Stack gap={2}>
          <Title order={4} fw={600} c="gray.9">
            {t(tDashboard.stockMovementChart.title)}
          </Title>
          <Text fz="xs" c="gray.6">
            {t(tDashboard.stockMovementChart.subtitle)}
          </Text>
        </Stack>
        {isLoading ? (
          <Skeleton h={260} radius="sm" />
        ) : chartData.length === 0 ? (
          <Text c="gray.5" fz="sm" ta="center" py="xl">
            {t(tDashboard.stockMovementChart.empty)}
          </Text>
        ) : (
          <BarChart
            h={260}
            data={chartData}
            dataKey="date"
            series={[
              { name: labelIn, color: "teal.6" },
              { name: labelOut, color: "red.6" },
              { name: labelAdjust, color: "gray.6" },
            ]}
            withLegend
            tickLine="y"
          />
        )}
      </Stack>
    </SurfaceCard>
  );
};
