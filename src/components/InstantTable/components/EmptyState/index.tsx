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
          background: "var(--mantine-primary-color-light)",
          border: "1px solid color-mix(in srgb, var(--mantine-primary-color-filled) 25%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <InboxIcon
          size={26}
          strokeWidth={1.5}
          color="var(--mantine-primary-color-light-color)"
        />
      </div>
      <Text fz={14} fw={600}>
        {entityName
          ? t(tBasic.textNoRecordFound(t(entityName)))
          : t(tBasic.textNoDataFound)}
      </Text>
      {entityName && (
        <Text fz={12} c="dimmed">
          {t(tBasic.textDetailNoRecordFound(t(entityName)))}
        </Text>
      )}
    </Stack>
  );
};
