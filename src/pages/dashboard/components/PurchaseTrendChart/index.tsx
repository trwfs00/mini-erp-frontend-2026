import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { PurchaseTrendPoint } from "@/types/report/PurchaseSummary";

type Props = {
  data: PurchaseTrendPoint[];
  isLoading?: boolean;
};

export const PurchaseTrendChart: FC<Props> = ({ data, isLoading }) => {
  const chartData = data.map((d) => ({
    month: d.month.slice(5),
    Amount: d.total_amount,
    Orders: d.order_count,
  }));

  return (
    <SurfaceCard>
      <Stack gap="sm">
        <Stack gap={2}>
          <Title order={4} fw={600} c="gray.9">
            Purchase Trend
          </Title>
          <Text fz="xs" c="gray.6">
            Last 6 months · total amount
          </Text>
        </Stack>
        {isLoading ? (
          <Skeleton h={260} radius="sm" />
        ) : chartData.length === 0 ? (
          <Text c="gray.5" fz="sm" ta="center" py="xl">
            No purchase data yet.
          </Text>
        ) : (
          <LineChart
            h={260}
            data={chartData}
            dataKey="month"
            series={[{ name: "Amount", color: "indigo.6" }]}
            curveType="monotone"
            withDots
            withLegend
          />
        )}
      </Stack>
    </SurfaceCard>
  );
};
