import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { StockMovementDailyPoint } from "@/types/report/StockMovementReport";

type Props = {
  data: StockMovementDailyPoint[];
  isLoading?: boolean;
};

export const StockMovementChart: FC<Props> = ({ data, isLoading }) => {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    In: d.in,
    Out: d.out,
    Adjust: d.adjust,
  }));

  return (
    <SurfaceCard>
      <Stack gap="sm">
        <Stack gap={2}>
          <Title order={4} fw={600} c="gray.9">
            Stock Movement
          </Title>
          <Text fz="xs" c="gray.6">
            Last 14 days · IN / OUT / ADJUST
          </Text>
        </Stack>
        {isLoading ? (
          <Skeleton h={260} radius="sm" />
        ) : chartData.length === 0 ? (
          <Text c="gray.5" fz="sm" ta="center" py="xl">
            No movement in this period.
          </Text>
        ) : (
          <BarChart
            h={260}
            data={chartData}
            dataKey="date"
            series={[
              { name: "In", color: "teal.6" },
              { name: "Out", color: "red.6" },
              { name: "Adjust", color: "gray.6" },
            ]}
            withLegend
            tickLine="y"
          />
        )}
      </Stack>
    </SurfaceCard>
  );
};
