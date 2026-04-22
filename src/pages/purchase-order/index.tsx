import { PageLayout } from "@/components/Layouts/Page";
import { Paper, Stack, Text, Title } from "@mantine/core";
import { ClipboardList } from "lucide-react";

const PurchaseOrderPage = () => {
  return (
    <PageLayout>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2} fw={700} c="gray.9">
            Purchase Orders
          </Title>
          <Text c="gray.6" fz="sm">
            Create and track purchase orders.
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
            <ClipboardList size={40} strokeWidth={1.5} color="#9ca3af" />
            <Text c="gray.6">Content for purchase orders goes here.</Text>
          </Stack>
        </Paper>
      </Stack>
    </PageLayout>
  );
};

export default PurchaseOrderPage;
