import {
  Alert,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { PurchaseSummaryReportTable } from "@/components/Tables/PurchaseSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { currentYearMonth } from "@/utils/DateUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { ExportButton } from "../ExportButton";
// TODO: เปลี่ยนเป็น ReportService.exportPurchaseSummary เมื่อ integrate API จริง
import { MockReportExportUtil } from "../../utils/mockReportExport";

export const PurchaseSummaryReportPage = () => {
  const [month, setMonth] = useState(currentYearMonth);
  const {
    report,
    totals,
    rows,
    isLoadingInitialData,
    isReloading,
    pagination,
    sortHandler,
    reloadReport,
  } = useLoadInitialData({ month });
  const [exportError, setExportError] = useState<string | null>(null);

  return (
    <Stack gap="md" pos="relative" mih={300}>
      <LoadingOverlay visible={isLoadingInitialData} />
      <Group justify="space-between" wrap="wrap" gap="md" align="flex-end">
        <TextInput
          type="month"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.currentTarget.value)}
          size="sm"
        />
        <Group>
          <RefreshButton onClick={async () => await reloadReport()} />
          <ExportButton
            label="Export CSV"
            filename={`purchase-summary-${month}.csv`}
            disabled={!report}
            onExport={async () =>
              report
                ? { ok: true, data: MockReportExportUtil.exportPurchaseSummary(report) }
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
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
          <StatTile
            label="Orders"
            value={totals.total_orders.toLocaleString()}
          />
          <StatTile
            label="Amount"
            value={formatCurrency(totals.total_amount)}
          />
          <StatTile label="Draft" value={totals.by_status.DRAFT.toString()} />
          <StatTile
            label="Confirmed"
            value={totals.by_status.CONFIRMED.toString()}
          />
          <StatTile
            label="Received"
            value={totals.by_status.RECEIVED.toString()}
          />
          <StatTile
            label="Cancelled"
            value={totals.by_status.CANCELLED.toString()}
          />
        </SimpleGrid>
      )}

      <PurchaseSummaryReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isReloading}
      />
    </Stack>
  );
};
