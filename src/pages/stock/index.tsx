import { PageLayout } from "@/components/Layouts/Page";
import { Paper, Stack, Text, Title } from "@mantine/core";
import { Warehouse } from "lucide-react";

const StockPage = () => {
  return (
    <PageLayout>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2} fw={700} c="gray.9">
            Stock
          </Title>
          <Text c="gray.6" fz="sm">
            Track inventory levels and movements.
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
            <Warehouse size={40} strokeWidth={1.5} color="#9ca3af" />
            <Text c="gray.6">Content for stock goes here.</Text>
          </Stack>
        </Paper>
      </Stack>
    </PageLayout>
  );
};

export default StockPage;
