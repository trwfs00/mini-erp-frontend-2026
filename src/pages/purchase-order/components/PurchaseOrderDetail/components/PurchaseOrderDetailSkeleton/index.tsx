import {
  ActionIcon,
  Divider,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import type { FC } from "react";

type Props = {
  onBack: () => void;
};

const ITEM_ROW_COUNT = 4;

export const PurchaseOrderDetailSkeleton: FC<Props> = ({ onBack }) => (
  <Stack gap="lg">
    <Group justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <ActionIcon variant="subtle" color="gray" onClick={onBack}>
          <ArrowLeft size={20} />
        </ActionIcon>
        <Stack gap={6}>
          <Group gap="xs">
            <Skeleton height={26} width={180} radius="sm" />
            <Skeleton height={22} width={80} radius="xl" />
          </Group>
          <Skeleton height={12} width={260} radius="sm" />
        </Stack>
      </Group>
      <Group gap="sm">
        <Skeleton height={36} width={140} radius="sm" />
        <Skeleton height={36} width={150} radius="sm" />
      </Group>
    </Group>

    <Grid>
      <Grid.Col span={{ base: 12, md: 8 }}>
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
            </Group>

            {Array.from({ length: ITEM_ROW_COUNT }).map((_, i) => (
              <Group
                key={i}
                gap="md"
                wrap="nowrap"
                py="md"
                px="md"
                style={{
                  borderBottom:
                    "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap={4} style={{ flex: 1 }}>
                  <Skeleton height={14} width={`${50 + (i * 13) % 30}%`} radius="sm" />
                  <Skeleton height={10} width={80} radius="sm" />
                </Stack>
                <Skeleton height={14} width={40} radius="sm" />
                <Skeleton height={14} width={90} radius="sm" />
                <Skeleton height={14} width={100} radius="sm" />
              </Group>
            ))}

            <Divider />
            <Group justify="flex-end" p="md" gap="xl">
              <Skeleton height={18} width={120} radius="sm" />
              <Skeleton height={26} width={140} radius="sm" />
            </Group>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <Paper withBorder p="md" radius="md">
            <Stack gap="sm">
              <Skeleton height={18} width={160} radius="sm" />
              <Group justify="space-between">
                <Skeleton height={12} width={50} radius="sm" />
                <Skeleton height={12} width={120} radius="sm" />
              </Group>
              <Group justify="space-between">
                <Skeleton height={12} width={30} radius="sm" />
                <Skeleton height={12} width={100} radius="sm" />
              </Group>
            </Stack>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Stack gap="sm">
              <Skeleton height={18} width={140} radius="sm" />
              <Group gap="xs">
                <Skeleton height={20} width={70} radius="xl" />
                <Skeleton height={12} width={100} radius="sm" />
              </Group>
              <Group gap="xs">
                <Skeleton height={20} width={80} radius="xl" />
                <Skeleton height={12} width={120} radius="sm" />
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  </Stack>
);
