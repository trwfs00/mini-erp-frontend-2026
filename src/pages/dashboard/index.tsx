import { PageLayout } from "@/components/Layouts/Page";
import { RefreshButton } from "@/components/RefreshButton";
import { ROUTE_PATHS } from "@/router/routePaths";
import { Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { SummaryCards } from "./components/SummaryCards";
import { StockMovementChart } from "./components/StockMovementChart";
import { PurchaseTrendChart } from "./components/PurchaseTrendChart";
import { LowStockWarningList } from "./components/LowStockWarningList";
import { tMenu } from "@/consts/translations/tMenu";
import { tDashboard } from "@/consts/translations/tDashboard";
import { useTranslation } from "@/hooks/translation/useTranslation";

export const DashboardPage = () => {
  const t = useTranslation();
  const {
    isLoadingInitialData,
    summary,
    movement,
    trend,
    lowStock,
    isReloadingSummary,
    isReloadingMovement,
    isReloadingTrend,
    isReloadingLowStock,
    reloadAll,
  } = useLoadInitialData();

  return (
    <PageLayout
      breadcrumbs={{ label: tMenu.dashboard, path: ROUTE_PATHS.DASHBOARD }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={2} fw={700}>
              {t(tDashboard.title)}
            </Title>
            <Text c="dimmed" fz="sm">
              {t(tDashboard.description)}
            </Text>
          </Stack>

          <RefreshButton onClick={reloadAll} />
        </Group>

        <SummaryCards
          summary={summary}
          isLoading={isLoadingInitialData || isReloadingSummary}
        />

        <Grid align="stretch">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <StockMovementChart
              data={movement ?? []}
              isLoading={isLoadingInitialData || isReloadingMovement}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <LowStockWarningList
              products={lowStock ?? []}
              isLoading={isLoadingInitialData || isReloadingLowStock}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <PurchaseTrendChart
              data={trend ?? []}
              isLoading={isLoadingInitialData || isReloadingTrend}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </PageLayout>
  );
};
