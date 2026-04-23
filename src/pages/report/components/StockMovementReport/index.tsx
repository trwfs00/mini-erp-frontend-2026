import { Alert, Group, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { RefreshButton } from "@/components/RefreshButton";
import { StatTile } from "@/components/StatTile";
import { SurfaceCard } from "@/components/SurfaceCard";
import { StockMovementReportTable } from "@/components/Tables/StockMovementReportTable";
import { ReportService } from "@/services/ReportService";
import { getLastNDaysRange } from "@/utils/DateUtil";
import { useLoadStockMovementData } from "../../hooks/useLoadStockMovementData";
import { ExportButton } from "../ExportButton";

const defaultRange = () => getLastNDaysRange(14);

const StockMovementReportPage = () => {
  const [range, setRange] = useState(defaultRange);
  const { totals, daily, rows, isLoading, pagination, sortHandler, reloadStockMovement } =
    useLoadStockMovementData(range);
  const [exportError, setExportError] = useState<string | null>(null);

  const chartData = useMemo(
    () =>
      daily.map((d) => ({
        date: d.date.slice(5),
        In: d.in,
        Out: d.out,
        Adjust: d.adjust,
      })),
    [daily],
  );

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md" align="flex-end">
        <Group gap="sm">
          <TextInput
            type="date"
            label="From"
            value={range.from}
            onChange={(e) => setRange((r) => ({ ...r, from: e.currentTarget.value }))}
            size="sm"
          />
          <TextInput
            type="date"
            label="To"
            value={range.to}
            onChange={(e) => setRange((r) => ({ ...r, to: e.currentTarget.value }))}
            size="sm"
          />
        </Group>
        <Group>
          <RefreshButton onClick={reloadStockMovement} />
          <ExportButton
            label="Export Excel"
            filename={`stock-movement-${range.from}-to-${range.to}.csv`}
            onExport={() => ReportService.exportStockMovement({ ...range, format: "xlsx" })}
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

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <StatTile label="Total IN" value={totals.total_in.toLocaleString()} color="teal.7" />
        <StatTile label="Total OUT" value={totals.total_out.toLocaleString()} color="red.7" />
        <StatTile label="Adjustments" value={totals.total_adjust.toLocaleString()} color="gray.7" />
      </SimpleGrid>

      <SurfaceCard>
        <Stack gap="sm">
          <Text fz="sm" fw={600}>Daily Movement</Text>
          {chartData.length === 0 ? (
            <Text c="gray.5" fz="sm" ta="center" py="xl">No transactions in this range.</Text>
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
        isLoading={isLoading}
      />
    </Stack>
  );
};

export default StockMovementReportPage;
