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
          background: "var(--mantine-color-blue-0)",
          border: "1px solid var(--mantine-color-blue-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          boxShadow: "0 4px 12px rgba(34, 139, 230, 0.06)",
        }}
      >
        <InboxIcon size={26} strokeWidth={1.5} color="var(--mantine-color-blue-6)" />
      </div>
      <Text fz={14} fw={600} c="gray.8">
        {entityName ? `No ${entityName} Found` : "No data Found"}
      </Text>
      {entityName && (
        <Text fz={12} c="gray.6">
          Click "Create {entityName}" to add new {entityName.toLowerCase()}.
        </Text>
      )}
    </Stack>
  );
};
