import { Alert, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { StockSummaryReportTable } from "@/components/Tables/StockSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { ReportService } from "@/services/ReportService";
import { useLoadStockSummaryData } from "../../hooks/useLoadStockSummaryData";
import { ExportButton } from "../ExportButton";

const StockSummaryReportPage = () => {
  const { totals, rows, isLoading, pagination, sortHandler, reloadStockSummary } =
    useLoadStockSummaryData();
  const [exportError, setExportError] = useState<string | null>(null);

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" align="flex-end">
        <Text fz="sm" c="gray.6">
          Snapshot of current stock with cost and selling valuation.
        </Text>
        <Group>
          <RefreshButton onClick={reloadStockSummary} />
          <ExportButton
            label="Export CSV"
            filename={`stock-summary-${new Date().toISOString().slice(0, 10)}.csv`}
            onExport={() => ReportService.exportStockSummary()}
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

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <StatTile label="Total Products" value={totals.total_products.toLocaleString()} />
        <StatTile label="Cost Value" value={formatCurrency(totals.total_cost_value)} />
        <StatTile label="Selling Value" value={formatCurrency(totals.total_selling_value)} />
        <StatTile label="Low Stock" value={`${totals.low_stock_count} items`} />
      </SimpleGrid>

      <StockSummaryReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isLoading}
      />
    </Stack>
  );
};

export default StockSummaryReportPage;
