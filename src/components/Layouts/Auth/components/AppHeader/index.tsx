import type { FC } from "react";
import { Badge, Burger, Group, Tooltip } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { $authUser } from "@/stores/authUserStore";
import { $mockMode, $authBypass } from "@/stores/debugModeStore";
import { UserMenu } from "@/components/UserMenu";

type AppHeaderProps = {
  mobileOpened: boolean;
  toggleMobile: () => void;
};

export const AppHeader: FC<AppHeaderProps> = ({
  mobileOpened,
  toggleMobile,
}) => {
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
        background: "light-dark(#fff, var(--mantine-color-dark-7))",
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
          aria-label="Toggle sidebar (mobile)"
        />
        {mockMode && (
          <Tooltip
            label="Using mock data — backend not connected"
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
              MOCK DATA MODE
            </Badge>
          </Tooltip>
        )}
        {authBypass && (
          <Tooltip
            label="Auth Bypass mode — using stored credentials"
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
              AUTH BYPASS MODE
            </Badge>
          </Tooltip>
        )}
      </Group>

      {authUser ? <UserMenu authUser={authUser} /> : <span />}
    </Group>
  );
};
