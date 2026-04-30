import { PageLayout } from "@/components/Layouts/Page";
import { Stack, Tabs, Text, Title } from "@mantine/core";
import { BarChart3, Repeat, Truck, type LucideIcon } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/router/routePaths";
import { tMenu } from "@/consts/translations/tMenu";
import { tReport } from "@/consts/translations/tReport";
import { useTranslation } from "@/hooks/translation/useTranslation";
import type { Language } from "@/types/language/Language";

type ReportTab = {
  value: string;
  label: Record<Language, string>;
  icon: LucideIcon;
};

const TABS: ReportTab[] = [
  {
    value: ROUTE_PATHS.REPORT_STOCK_SUMMARY,
    label: tMenu.reportStockSummary,
    icon: BarChart3,
  },
  {
    value: ROUTE_PATHS.REPORT_STOCK_MOVEMENT,
    label: tMenu.reportStockMovement,
    icon: Repeat,
  },
  {
    value: ROUTE_PATHS.REPORT_PURCHASE_SUMMARY,
    label: tMenu.reportPurchaseSummary,
    icon: Truck,
  },
];

export const ReportPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const t = useTranslation();

  const active =
    TABS.find((tab) => pathname.startsWith(tab.value))?.value ?? TABS[0].value;
  const activeTab = TABS.find((tab) => tab.value === active);

  return (
    <PageLayout
      breadcrumbs={[
        { label: tMenu.report, path: ROUTE_PATHS.REPORT },
        ...(activeTab
          ? [{ label: activeTab.label, path: activeTab.value }]
          : []),
      ]}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2} fw={700} c="gray.9">
            {t(tMenu.report)}
          </Title>
          <Text c="gray.6" fz="sm">
            {t(tReport.pageDescription)}
          </Text>
        </Stack>

        <Tabs
          value={active}
          onChange={(v) => v && navigate(v)}
          variant="outline"
        >
          <Tabs.List>
            {TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                leftSection={<tab.icon size={14} />}
              >
                {t(tab.label)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <Outlet />
      </Stack>
    </PageLayout>
  );
};
