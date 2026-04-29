import { Stack, Text } from "@mantine/core";
import { InboxIcon } from "lucide-react";
import type { FC } from "react";

type Props = {
  entityName?: string;
};

export const EmptyState: FC<Props> = ({ entityName }) => {
  return (
    <Stack align="center" gap={6} mb={57}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "16px",
          background: "var(--mantine-primary-color-light)",
          border: "1px solid color-mix(in srgb, var(--mantine-primary-color-filled) 25%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <InboxIcon size={26} strokeWidth={1.5} color="var(--mantine-primary-color-light-color)" />
      </div>
      <Text fz={14} fw={600}>
        {entityName ? `No ${entityName} Found` : "No data Found"}
      </Text>
      {entityName && (
        <Text fz={12} c="dimmed">
          Click "Create {entityName}" to add new {entityName.toLowerCase()}.
        </Text>
      )}
    </Stack>
  );
};
