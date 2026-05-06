import type { FC } from "react";
import { Badge, Box, Burger, Group, Tooltip } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { $authUser } from "@/stores/authUserStore";
import { $mockMode, $authBypass } from "@/stores/debugModeStore";
import { LanguageButton } from "./components/LanguageButton";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tLayout } from "@/consts/translations/tLayout";
import { UserMenu } from "@/components/UserMenu";
import { SearchTrigger } from "@/components/SearchTrigger";
import { NotificationCenter } from "@/components/NotificationCenter";
import { BYPASS_ADMIN_USER } from "@/consts/auth/bypassUser";

type AppHeaderProps = {
  mobileOpened: boolean;
  toggleMobile: () => void;
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
        borderBottom:
          "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
        background:
          "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
      }}
    >
      <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
          aria-label={t(tLayout.header.toggleSidebarMobile)}
        />

        <Box visibleFrom="sm">
          <SearchTrigger />
        </Box>

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

      <Group gap="xs" wrap="nowrap">
        <LanguageButton />
        <NotificationCenter />

        {(() => {
          // TODO: ลบ fallback BYPASS_ADMIN_USER ออกเมื่อ integrate API จริง
          const displayUser =
            authUser ?? (authBypass ? BYPASS_ADMIN_USER : null);
          return displayUser ? <UserMenu authUser={displayUser} /> : <span />;
        })()}
      </Group>
    </Group>
  );
};
