import { Stack, Text } from "@mantine/core";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";

type Props = {
  label: string;
  value: string;
  color?: string;
};

export const StatTile: FC<Props> = ({ label, value, color = "gray.9" }) => (
  <SurfaceCard padding="md">
    <Stack gap={4}>
      <Text fz="xs" c="gray.6" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text fz="lg" fw={700} c={color}>
        {value}
      </Text>
    </Stack>
  </SurfaceCard>
);
