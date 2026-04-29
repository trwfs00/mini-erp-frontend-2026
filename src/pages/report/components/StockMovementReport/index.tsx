import {
  Alert,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { AppLoadingOverlay } from "@/components/AppLoadingOverlay";
import { BarChart } from "@mantine/charts";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { SurfaceCard } from "@/components/SurfaceCard";
import { StockMovementReportTable } from "@/components/Tables/StockMovementReportTable";
import { getLastNDaysRange } from "@/utils/DateUtil";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { ExportButton } from "../ExportButton";
import { usePermission } from "@/hooks/auth/usePermission";
// TODO: เปลี่ยนเป็น ReportService.exportStockMovement เมื่อ integrate API จริง
import { MockReportExportUtil } from "../../utils/mockReportExport";

const defaultRange = () => getLastNDaysRange(14);

export const StockMovementReportPage = () => {
  const [range, setRange] = useState(defaultRange);
  const {
    report,
    totals,
    daily,
    rows,
    isLoadingInitialData,
    isReloading,
    pagination,
    sortHandler,
    reloadReport,
  } = useLoadInitialData({ range });
  const [exportError, setExportError] = useState<string | null>(null);
  const canExport = usePermission("report", ["export"]);

  const chartData = (daily ?? []).map((d) => ({
    date: d.date.slice(5),
    In: d.in,
    Out: d.out,
    Adjust: d.adjust,
  }));

  return (
    <Stack gap="md" pos="relative" mih={300}>
      <AppLoadingOverlay visible={isLoadingInitialData} />
      <Group justify="space-between" wrap="wrap" gap="md" align="flex-end">
        <Group gap="sm">
          <TextInput
            type="date"
            label="From"
            value={range.from}
            onChange={(e) =>
              setRange((r) => ({ ...r, from: e.currentTarget.value }))
            }
            size="sm"
          />
          <TextInput
            type="date"
            label="To"
            value={range.to}
            onChange={(e) =>
              setRange((r) => ({ ...r, to: e.currentTarget.value }))
            }
            size="sm"
          />
        </Group>
        <Group>
          <RefreshButton onClick={async () => await reloadReport()} />
          {canExport && (
            <ExportButton
              label="Export CSV"
              filename={`stock-movement-${range.from}-to-${range.to}.csv`}
              disabled={!report}
              onExport={async () =>
                report
                  ? { ok: true, data: MockReportExportUtil.exportStockMovement(report) }
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

      {totals && (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <StatTile
            label="Total IN"
            value={totals.total_in.toLocaleString()}
            color="teal.7"
          />
          <StatTile
            label="Total OUT"
            value={totals.total_out.toLocaleString()}
            color="red.7"
          />
          <StatTile
            label="Adjustments"
            value={totals.total_adjust.toLocaleString()}
            color="gray.7"
          />
        </SimpleGrid>
      )}

      <SurfaceCard>
        <Stack gap="sm">
          <Text fz="sm" fw={600}>
            Daily Movement
          </Text>
          {chartData.length === 0 ? (
            <Text c="gray.5" fz="sm" ta="center" py="xl">
              No transactions in this range.
            </Text>
          ) : (
            <BarChart
              h={260}
              data={chartData}
              dataKey="date"
              series={[
                { name: "In", color: "teal.6" },
                { name: "Out", color: "red.6" },
                { name: "Adjust", color: "gray.6" },
              ]}
              withLegend
              tickLine="y"
            />
          )}
        </Stack>
      </SurfaceCard>

      <StockMovementReportTable
        records={rows}
        pagination={pagination}
        sortHandler={sortHandler}
        isLoading={isReloading}
      />
    </Stack>
  );
};
