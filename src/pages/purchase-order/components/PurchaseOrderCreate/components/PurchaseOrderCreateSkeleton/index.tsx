import { Divider, Group, Paper, Skeleton, Stack } from "@mantine/core";

const ROW_COUNT = 3;

export const PurchaseOrderCreateSkeleton = () => (
  <Stack gap="md">
    <Paper withBorder p="md" radius="md">
      <Group grow align="flex-start">
        <Stack gap={6}>
          <Skeleton height={11} width={90} radius="sm" />
          <Skeleton height={36} radius="sm" />
        </Stack>
        <Stack gap={6}>
          <Skeleton height={11} width={70} radius="sm" />
          <Skeleton height={36} radius="sm" />
        </Stack>
      </Group>
    </Paper>

    <Paper withBorder radius="md">
      <Stack gap={0}>
        <Group
          gap="md"
          wrap="nowrap"
          py="sm"
          px="md"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Skeleton height={12} width={70} radius="sm" style={{ flex: 1 }} />
          <Skeleton height={12} width={70} radius="sm" />
          <Skeleton height={12} width={80} radius="sm" />
          <Skeleton height={12} width={70} radius="sm" />
          <Skeleton height={12} width={20} radius="sm" />
        </Group>

        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <Group
            key={i}
            gap="md"
            wrap="nowrap"
            py="sm"
            px="md"
            style={{
              borderBottom: "1px solid var(--mantine-color-default-border)",
            }}
          >
            <Skeleton height={36} radius="sm" style={{ flex: 1 }} />
            <Skeleton height={36} width={120} radius="sm" />
            <Skeleton height={36} width={170} radius="sm" />
            <Skeleton height={20} width={100} radius="sm" />
            <Skeleton height={28} width={28} radius="sm" />
          </Group>
        ))}

        <Divider />
        <Group justify="space-between" p="md">
          <Skeleton height={36} width={140} radius="sm" />
          <Group gap="md">
            <Skeleton height={18} width={120} radius="sm" />
            <Skeleton height={26} width={140} radius="sm" />
          </Group>
        </Group>
      </Stack>
    </Paper>
  </Stack>
);
