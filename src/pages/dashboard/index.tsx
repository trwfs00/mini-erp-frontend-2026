import { PageLayout } from "@/components/Layouts/Page";
import { RefreshButton } from "@/components/RefreshButton";
import { Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useLoadDashboardStats } from "./hooks/useLoadDashboardStats";
import { SummaryCards } from "./components/SummaryCards";
import { StockMovementChart } from "./components/StockMovementChart";
import { PurchaseTrendChart } from "./components/PurchaseTrendChart";
import { LowStockWarningList } from "./components/LowStockWarningList";

const DashboardPage = () => {
  const {
    summary,
    stockMovement,
    purchaseTrend,
    lowStockProducts,
    isLoading,
    reloadDashboardStats,
  } = useLoadDashboardStats();

  return (
    <PageLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700} c="gray.9">
              Dashboard
            </Title>
            <Text c="gray.6" fz="sm">
              Overview of your business at a glance.
            </Text>
          </Stack>

          <RefreshButton onClick={reloadDashboardStats} />
        </Group>

        <SummaryCards summary={summary} />

        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <StockMovementChart data={stockMovement} isLoading={isLoading} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <LowStockWarningList products={lowStockProducts} isLoading={isLoading} />
          </Grid.Col>
          <Grid.Col span={12}>
            <PurchaseTrendChart data={purchaseTrend} isLoading={isLoading} />
          </Grid.Col>
        </Grid>
      </Stack>
    </PageLayout>
  );
};

export default DashboardPage;
