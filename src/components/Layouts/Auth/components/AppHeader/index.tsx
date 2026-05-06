import type { FC } from "react";
import { Box, Burger, Group } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { $authUser } from "@/stores/authUserStore";
import { LanguageButton } from "./components/LanguageButton";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tLayout } from "@/consts/translations/tLayout";
import { UserMenu } from "@/components/UserMenu";
import { SearchTrigger } from "@/components/SearchTrigger";
import { NotificationCenter } from "@/components/NotificationCenter";

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
      </Group>

      <Group gap="xs" wrap="nowrap">
        <LanguageButton />
        <NotificationCenter />
        {authUser ? <UserMenu authUser={authUser} /> : <span />}
      </Group>
    </Group>
  );
};
