import {
  Alert,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { StockSummaryReportTable } from "@/components/Tables/StockSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { ExportButton } from "../ExportButton";
// TODO: เปลี่ยนเป็น ReportService.exportStockSummary เมื่อ integrate API จริง
import { MockReportExportUtil } from "../../utils/mockReportExport";

export const StockSummaryReportPage = () => {
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

  return (
    <Stack gap="md" pos="relative" mih={300}>
      <LoadingOverlay
        visible={isLoadingInitialData}
        overlayProps={{ blur: 1, backgroundOpacity: 0 }}
        loaderProps={{ type: "oval" }}
      />
      <Group justify="space-between" wrap="wrap" align="flex-end">
        <Text fz="sm" c="dimmed">
          Snapshot of current stock with cost and selling valuation.
        </Text>
        <Group>
          <RefreshButton onClick={async () => await reloadReport()} />
          <ExportButton
            label="Export CSV"
            filename={`stock-summary-${new Date().toISOString().slice(0, 10)}.csv`}
            disabled={!report}
            onExport={async () =>
              report
                ? { ok: true, data: MockReportExportUtil.exportStockSummary(report) }
                : { ok: false, message: "Report not loaded" }
            }
            onError={setExportError}
          />
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
            label="Total Products"
            value={totals.total_products.toLocaleString()}
          />
          <StatTile
            label="Cost Value"
            value={formatCurrency(totals.total_cost_value)}
          />
          <StatTile
            label="Selling Value"
            value={formatCurrency(totals.total_selling_value)}
          />
          <StatTile
            label="Low Stock"
            value={`${totals.low_stock_count} items`}
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
