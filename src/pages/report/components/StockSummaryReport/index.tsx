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
  const canExport = usePermission("report", ["export"]);

  return (
    <Stack gap="md" pos="relative" mih={300}>
      <Group justify="space-between" wrap="wrap" align="flex-end">
        <Text fz="sm" c="dimmed">
          Snapshot of current stock with cost and selling valuation.
        </Text>
        <Group>
          <RefreshButton onClick={async () => await reloadReport()} />
          {canExport && (
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
          label="Total Products"
          value={totals?.total_products.toLocaleString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Cost Value"
          value={totals ? formatCurrency(totals.total_cost_value) : "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Selling Value"
          value={totals ? formatCurrency(totals.total_selling_value) : "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Low Stock"
          value={totals ? `${totals.low_stock_count} items` : "-"}
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
