import { PageLayout } from "@/components/Layouts/Page";
import { Stack, Tabs, Text, Title } from "@mantine/core";
import { BarChart3, Repeat, Truck } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/router/routePaths";

const TABS = [
  {
    value: ROUTE_PATHS.REPORT_STOCK_SUMMARY,
    label: "Stock Summary",
    icon: BarChart3,
  },
  {
    value: ROUTE_PATHS.REPORT_STOCK_MOVEMENT,
    label: "Stock Movement",
    icon: Repeat,
  },
  {
    value: ROUTE_PATHS.REPORT_PURCHASE_SUMMARY,
    label: "Purchase Summary",
    icon: Truck,
  },
];

const ReportPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active =
    TABS.find((t) => pathname.startsWith(t.value))?.value ?? TABS[0].value;
  const activeTab = TABS.find((t) => t.value === active);

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Report", path: ROUTE_PATHS.REPORT },
        ...(activeTab
          ? [{ label: activeTab.label, path: activeTab.value }]
          : []),
      ]}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2} fw={700} c="gray.9">
            Report
          </Title>
          <Text c="gray.6" fz="sm">
            Analytics and exportable business reports.
          </Text>
        </Stack>

        <Tabs
          value={active}
          onChange={(v) => v && navigate(v)}
          variant="outline"
        >
          <Tabs.List>
            {TABS.map((t) => (
              <Tabs.Tab
                key={t.value}
                value={t.value}
                leftSection={<t.icon size={14} />}
              >
                {t.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <Outlet />
      </Stack>
    </PageLayout>
  );
};

export default ReportPage;
