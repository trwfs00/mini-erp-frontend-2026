import type { FC } from "react";
import {
  Avatar,
  Badge,
  Box,
  Burger,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { useStore } from "@nanostores/react";
import { $authUser } from "@/stores/authUserStore";
import { $mockMode, $authBypass } from "@/stores/debugModeStore";
import { LanguageButton } from "./components/LanguageButton";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tLayout } from "@/consts/translations/tLayout";

type AppHeaderProps = {
  mobileOpened: boolean;
  toggleMobile: () => void;
};

const getInitials = (name?: string | null): string => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
};

export const AppHeader: FC<AppHeaderProps> = ({
  mobileOpened,
  toggleMobile,
}) => {
  const t = useTranslation();
  const authUser = useStore($authUser);
  const mockMode = useStore($mockMode);
  const authBypass = useStore($authBypass);

  return (
    <Group
      h="100%"
      px="md"
      justify="space-between"
      wrap="nowrap"
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-2)",
        background: "#fff",
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
          aria-label={t(tLayout.header.toggleSidebarMobile)}
        />
        {mockMode && (
          <Tooltip
            label={t(tLayout.header.mockTooltip)}
            position="bottom"
            withArrow
          >
            <Badge
              variant="light"
              color="orange"
              size="sm"
              radius="sm"
              styles={{ label: { letterSpacing: 0.4 } }}
            >
              {t(tLayout.header.mockBadge)}
            </Badge>
          </Tooltip>
        )}
        {authBypass && (
          <Tooltip
            label={t(tLayout.header.authBypassTooltip)}
            position="bottom"
            withArrow
          >
            <Badge
              variant="light"
              color="indigo"
              size="sm"
              radius="sm"
              styles={{ label: { letterSpacing: 0.4 } }}
            >
              {t(tLayout.header.authBypassBadge)}
            </Badge>
          </Tooltip>
        )}
      </Group>

      {authUser ? (
        <Group gap={10} wrap="nowrap">
          <LanguageButton />
          <Box visibleFrom="sm" style={{ minWidth: 0, textAlign: "right" }}>
            <Text fz="sm" fw={600} c="gray.9" lh={1.2} truncate>
              {authUser.username}
            </Text>
            <Text fz="xs" c="gray.6" lh={1.2} truncate>
              {authUser.role.name}
            </Text>
          </Box>
          <Avatar
            size={34}
            radius="xl"
            color="indigo"
            variant="gradient"
            gradient={{ from: "indigo", to: "violet", deg: 135 }}
            styles={{
              placeholder: {
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.3,
              },
            }}
          >
            {getInitials(authUser.username)}
          </Avatar>
        </Group>
      ) : (
        <span />
      )}
    </Group>
  );
};
