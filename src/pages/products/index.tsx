import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import { Package } from "lucide-react";

const ProductsPage = () => {
  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2} fw={700} c="gray.9">
            Products
          </Title>
          <Text c="gray.6" fz="sm">
            Manage your product catalog.
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
            <Package size={40} strokeWidth={1.5} color="#9ca3af" />
            <Text c="gray.6">Content for products goes here.</Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProductsPage;
