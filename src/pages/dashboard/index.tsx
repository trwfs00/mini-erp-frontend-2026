import { PageLayout } from "@/components/Layouts/Page";
import { RefreshButton } from "@/components/RefreshButton";
import { Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { SummaryCards } from "./components/SummaryCards";
import { StockMovementChart } from "./components/StockMovementChart";
import { PurchaseTrendChart } from "./components/PurchaseTrendChart";
import { LowStockWarningList } from "./components/LowStockWarningList";

export const DashboardPage = () => {
  const { dashboardData, isLoadingInitialData, reloadDashboard } =
    useLoadInitialData();

  return (
    <PageLayout isLoading={isLoadingInitialData}>
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

          <RefreshButton onClick={reloadDashboard} />
        </Group>

        {dashboardData && (
          <>
            <SummaryCards summary={dashboardData.summary} />

            <Grid align="stretch">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <StockMovementChart
                  data={dashboardData.stock_movement}
                  isLoading={isLoadingInitialData}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <LowStockWarningList
                  products={dashboardData.low_stock_products}
                  isLoading={isLoadingInitialData}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <PurchaseTrendChart
                  data={dashboardData.purchase_trend}
                  isLoading={isLoadingInitialData}
                />
              </Grid.Col>
            </Grid>
          </>
        )}
      </Stack>
    </PageLayout>
  );
};
