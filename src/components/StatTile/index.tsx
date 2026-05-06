import { Skeleton, Stack, Text } from "@mantine/core";
import type { FC } from "react";
import { SurfaceCard } from "@/components/SurfaceCard";

type Props = {
  label: string;
  value: string;
  color?: string;
  isLoading?: boolean;
};

export const StatTile: FC<Props> = ({ label, value, color, isLoading }) => (
  <SurfaceCard padding="md">
    <Stack gap={4}>
      <Text fz="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      {isLoading ? (
        <Skeleton height={22} width="70%" radius="sm" mt={4} />
      ) : (
        <Text fz="lg" fw={700} c={color}>
          {value}
        </Text>
      )}
    </Stack>
  </SurfaceCard>
);
