import type { FC } from "react";
import { Grid, Group, Skeleton, Stack } from "@mantine/core";
import { SurfaceCard } from "@/components/SurfaceCard";

const STAT_TILES = 6;

const StatTileSkeleton: FC = () => (
  <SurfaceCard p="md">
    <Stack gap={8}>
      <Skeleton height={12} width="60%" radius="sm" />
      <Skeleton height={28} width="80%" radius="sm" />
    </Stack>
  </SurfaceCard>
);

const ChartSkeleton: FC<{ height?: number }> = ({ height = 320 }) => (
  <SurfaceCard p="md">
    <Stack gap="md">
      <Group justify="space-between">
        <Skeleton height={18} width={180} radius="sm" />
        <Skeleton height={14} width={80} radius="sm" />
      </Group>
      <Skeleton height={height} radius="md" />
    </Stack>
  </SurfaceCard>
);

const LowStockListSkeleton: FC = () => (
  <SurfaceCard p="md">
    <Stack gap="md">
      <Skeleton height={18} width={160} radius="sm" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Group key={i} justify="space-between">
          <Stack gap={4} style={{ flex: 1 }}>
            <Skeleton height={12} width="70%" radius="sm" />
            <Skeleton height={10} width="40%" radius="sm" />
          </Stack>
          <Skeleton height={20} width={48} radius="xl" />
        </Group>
      ))}
    </Stack>
  </SurfaceCard>
);

export const DashboardSkeleton: FC = () => {
  return (
    <Stack gap="lg">
      <Grid>
        {Array.from({ length: STAT_TILES }).map((_, i) => (
          <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <StatTileSkeleton />
          </Grid.Col>
        ))}
      </Grid>

      <Grid align="stretch">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <ChartSkeleton />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <LowStockListSkeleton />
        </Grid.Col>
        <Grid.Col span={12}>
          <ChartSkeleton height={260} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
