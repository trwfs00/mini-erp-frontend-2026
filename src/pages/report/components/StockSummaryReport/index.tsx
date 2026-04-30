import { Alert, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { AppLoadingOverlay } from "@/components/AppLoadingOverlay";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { StockSummaryReportTable } from "@/components/Tables/StockSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { ExportButton } from "../ExportButton";
import { usePermission } from "@/hooks/auth/usePermission";
// TODO: เปลี่ยนเป็น ReportService.exportStockSummary เมื่อ integrate API จริง
import { MockReportExportUtil } from "../../utils/mockReportExport";
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
      <AppLoadingOverlay visible={isLoadingInitialData} />
      <Group justify="space-between" wrap="wrap" align="flex-end">
        <Text fz="sm" c="gray.6">
          {t(tReport.stockSummary.description)}
        </Text>
        <Group>
          <RefreshButton onClick={async () => await reloadReport()} />
          {canExport && (
            <ExportButton
              label={t(tReport.exportCsv)}
              filename={`stock-summary-${new Date().toISOString().slice(0, 10)}.csv`}
              disabled={!report}
              onExport={async () =>
                report
                  ? { ok: true, data: MockReportExportUtil.exportStockSummary(report) }
                  : { ok: false, message: t(tReport.reportNotLoaded) }
              }
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

      {totals && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <StatTile
            label={t(tReport.stockSummary.statTotalProducts)}
            value={totals.total_products.toLocaleString()}
          />
          <StatTile
            label={t(tReport.stockSummary.statCostValue)}
            value={formatCurrency(totals.total_cost_value)}
          />
          <StatTile
            label={t(tReport.stockSummary.statSellingValue)}
            value={formatCurrency(totals.total_selling_value)}
          />
          <StatTile
            label={t(tReport.stockSummary.statLowStock)}
            value={`${totals.low_stock_count} ${t(tReport.stockSummary.items)}`}
          />
        </SimpleGrid>
      )}

      <StockSummaryReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isReloading}
      />
    </Stack>
  );
};
