import { Stack, Text } from "@mantine/core";
import { InboxIcon } from "lucide-react";
import type { FC } from "react";
import type { Language } from "@/types/language/Language";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";

type Props = {
  entityName?: Record<Language, string>;
};

export const EmptyState: FC<Props> = ({ entityName }) => {
  const t = useTranslation();
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
        <InboxIcon
          size={26}
          strokeWidth={1.5}
          color="var(--mantine-color-blue-6)"
        />
      </div>
      <Text fz={14} fw={600} c="gray.8">
        {entityName
          ? t(tBasic.textNoRecordFound(t(entityName)))
          : t(tBasic.textNoDataFound)}
      </Text>
      {entityName && (
        <Text fz={12} c="gray.6">
          {t(tBasic.textDetailNoRecordFound(t(entityName)))}
        </Text>
      )}
    </Stack>
  );
};
