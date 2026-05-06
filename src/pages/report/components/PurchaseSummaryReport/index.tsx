import { Alert, Group, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { PurchaseSummaryReportTable } from "@/components/Tables/PurchaseSummaryReportTable";
import { formatCurrency } from "@/utils/CurrencyUtil";
import { currentYearMonth } from "@/utils/DateUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { ExportButton } from "../ExportButton";
import { usePermission } from "@/hooks/auth/usePermission";
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
  const canExport = usePermission("report", ["export"]);

  return (
    <Stack gap="md" pos="relative" mih={300}>
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
          {canExport && (
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

      <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
        <StatTile
          label="Orders"
          value={totals?.total_orders.toLocaleString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Amount"
          value={totals ? formatCurrency(totals.total_amount) : "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Draft"
          value={totals?.by_status.DRAFT.toString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Confirmed"
          value={totals?.by_status.CONFIRMED.toString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Received"
          value={totals?.by_status.RECEIVED.toString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
        <StatTile
          label="Cancelled"
          value={totals?.by_status.CANCELLED.toString() ?? "-"}
          isLoading={isLoadingInitialData}
        />
      </SimpleGrid>

      <PurchaseSummaryReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isReloading}
        isLoadingInitial={isLoadingInitialData}
      />
    </Stack>
  );
};
