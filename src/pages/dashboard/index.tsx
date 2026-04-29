import { PageLayout } from "@/components/Layouts/Page";
import { RefreshButton } from "@/components/RefreshButton";
import { ROUTE_PATHS } from "@/router/routePaths";
import { Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { SummaryCards } from "./components/SummaryCards";
import { StockMovementChart } from "./components/StockMovementChart";
import { PurchaseTrendChart } from "./components/PurchaseTrendChart";
import { LowStockWarningList } from "./components/LowStockWarningList";

export const DashboardPage = () => {
  const { summary, movement, trend, lowStock, reloadAll } = useLoadInitialData();

  return (
    <PageLayout
      breadcrumbs={{ label: "Dashboard", path: ROUTE_PATHS.DASHBOARD }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700}>
              Dashboard
            </Title>
            <Text c="dimmed" fz="sm">
              Overview of your business at a glance.
            </Text>
          </Stack>

          <RefreshButton onClick={reloadAll} />
        </Group>

        <SummaryCards summary={summary.data} isLoading={summary.isLoading} />

        <Grid align="stretch">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <StockMovementChart
              data={movement.data ?? []}
              isLoading={movement.isLoading}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <LowStockWarningList
              products={lowStock.data ?? []}
              isLoading={lowStock.isLoading}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <PurchaseTrendChart
              data={trend.data ?? []}
              isLoading={trend.isLoading}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </PageLayout>
  );
};
