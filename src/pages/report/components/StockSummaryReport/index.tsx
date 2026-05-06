import { Alert, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { StockSummaryReportTable } from "@/components/Tables/StockSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { ExportButton } from "../ExportButton";
import { usePermission } from "@/hooks/auth/usePermission";
import { ReportService } from "@/services/ReportService";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tReport } from "@/consts/translations/tReport";

export const StockSummaryReportPage = () => {
  const t = useTranslation();
  const {
    report,
    totals,
    rows,
    isLoadingInitialData,
    isReloading,
    pagination,
    sortHandler,
    reloadReport,
  } = useLoadInitialData();
  const [exportError, setExportError] = useState<string | null>(null);
  const canExport = usePermission("report", ["export"]);

  return (
    <Stack gap="md" pos="relative" mih={300}>
      <Group justify="space-between" wrap="wrap" align="flex-end">
        <Text fz="sm" c="dimmed">
          {t(tReport.stockSummary.description)}
        </Text>
        <Group>
          <RefreshButton onClick={async () => await reloadReport()} />
          {canExport && (
            <ExportButton
              label={t(tReport.exportCsv)}
              filename={`stock-summary-${new Date().toISOString().slice(0, 10)}.csv`}
              disabled={!report}
              onExport={() => ReportService.exportStockSummary()}
              onError={setExportError}
            />
          )}
        </Group>
      </Group>

      {exportError && (
        <Alert
          color="red"
          icon={<AlertCircle size={18} />}
          variant="light"
          withCloseButton
          onClose={() => setExportError(null)}
        >
          {exportError}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <StatTile
          label={t(tReport.stockSummary.statTotalProducts)}
          value={totals?.total_products.toLocaleString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label={t(tReport.stockSummary.statCostValue)}
          value={totals ? formatCurrency(totals.total_cost_value) : "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label={t(tReport.stockSummary.statSellingValue)}
          value={totals ? formatCurrency(totals.total_selling_value) : "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label={t(tReport.stockSummary.statLowStock)}
          value={
            totals
              ? `${totals.low_stock_count} ${t(tReport.stockSummary.items)}`
              : "-"
          }
          isLoading={isLoadingInitialData}
        />
      </SimpleGrid>

      <StockSummaryReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isReloading}
        isLoadingInitial={isLoadingInitialData}
      />
    </Stack>
  );
};
