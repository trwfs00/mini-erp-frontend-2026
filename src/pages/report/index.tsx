import { PageLayout } from "@/components/Layouts/Page";
import { Paper, Stack, Text, Title } from "@mantine/core";
import { BarChart3 } from "lucide-react";

const ReportPage = () => {
  return (
    <PageLayout>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2} fw={700} c="gray.9">
            Report
          </Title>
          <Text c="gray.6" fz="sm">
            View analytics and business reports.
          </Text>
        </Stack>

        <Paper
          withBorder
          radius="md"
          p="xl"
          bg="white"
          style={{ borderColor: "var(--mantine-color-gray-2)" }}
        >
          <Stack align="center" gap="sm" py="xl">
            <BarChart3 size={40} strokeWidth={1.5} color="#9ca3af" />
            <Text c="gray.6">Content for reports goes here.</Text>
          </Stack>
        </Paper>
      </Stack>
    </PageLayout>
  );
};

export default ReportPage;
