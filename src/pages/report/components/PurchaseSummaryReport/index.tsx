import { Alert, Group, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { PurchaseSummaryReportTable } from "@/components/Tables/PurchaseSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { currentYearMonth } from "@/utils/DateUtil";
import { ReportService } from "@/services/ReportService";
import { useLoadPurchaseSummaryData } from "../../hooks/useLoadPurchaseSummaryData";
import { ExportButton } from "../ExportButton";

const PurchaseSummaryReportPage = () => {
  const [month, setMonth] = useState(currentYearMonth);
  const { totals, rows, isLoading, pagination, sortHandler, reloadPurchaseSummary } =
    useLoadPurchaseSummaryData(month);
  const [exportError, setExportError] = useState<string | null>(null);

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md" align="flex-end">
        <TextInput
          type="month"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.currentTarget.value)}
          size="sm"
        />
        <Group>
          <RefreshButton onClick={reloadPurchaseSummary} />
          <ExportButton
            label="Export Excel"
            filename={`purchase-summary-${month}.csv`}
            onExport={() => ReportService.exportPurchaseSummary({ month, format: "xlsx" })}
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

      <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
        <StatTile label="Orders" value={totals.total_orders.toLocaleString()} />
        <StatTile label="Amount" value={formatCurrency(totals.total_amount)} />
        <StatTile label="Draft" value={totals.by_status.DRAFT.toString()} />
        <StatTile label="Confirmed" value={totals.by_status.CONFIRMED.toString()} />
        <StatTile label="Received" value={totals.by_status.RECEIVED.toString()} />
        <StatTile label="Cancelled" value={totals.by_status.CANCELLED.toString()} />
      </SimpleGrid>

      <PurchaseSummaryReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isLoading}
      />
    </Stack>
  );
};

export default PurchaseSummaryReportPage;
