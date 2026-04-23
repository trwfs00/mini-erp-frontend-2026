import type { FC } from "react";
import {
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useLocation, useMatches } from "react-router-dom";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useStore } from "@nanostores/react";
import { $authUser } from "@/stores/authUserStore";
import { ROUTE_PATHS } from "@/router/routePaths";
import { AuthUtil } from "@/utils/AuthUtil";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { BreadcrumbItem } from "@/types/Global";

type AppHeaderProps = {
  mobileOpened: boolean;
  toggleMobile: () => void;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
};

export const AppHeader: FC<AppHeaderProps> = ({
  mobileOpened,
  toggleMobile,
}) => {
  const authUser = useStore($authUser);
  const { pathname } = useLocation();
  const matches = useMatches();

  const getCrumbs = (): BreadcrumbItem[] => {
    const baseCrumbs: BreadcrumbItem[] = [{ label: "Home", path: ROUTE_PATHS.DASHBOARD }];
    
    const routeCrumbs = matches
      .filter((match: any) => match.handle && match.handle.crumb)
      .map((match: any) => ({
        label: match.handle.crumb,
        path: match.pathname,
      }));

    // If we are on Dashboard, don't show Home twice if they are the same
    if (pathname === ROUTE_PATHS.DASHBOARD) {
      return [{ label: "Home" }];
    }

    return [...baseCrumbs, ...routeCrumbs];
  };

  const crumbs = getCrumbs();

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
      <Group gap="md" wrap="nowrap">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
          aria-label="Toggle sidebar (mobile)"
        />
        <Breadcrumb items={crumbs} />
      </Group>

      {authUser && (
        <Menu
          width={220}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              px="xs"
              py={6}
              style={{ borderRadius: 8 }}
              className="user-menu-trigger"
            >
              <Group gap={10} wrap="nowrap">
                <Avatar
                  size={34}
                  radius="xl"
                  color="indigo"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "violet", deg: 135 }}
                >
                  {getInitials(authUser.name)}
                </Avatar>
                <Box visibleFrom="sm" style={{ minWidth: 0 }}>
                  <Text fz="sm" fw={600} c="gray.9" lh={1.2} truncate>
                    {authUser.name}
                  </Text>
                  <Text fz="xs" c="gray.6" lh={1.2} truncate>
                    @{authUser.username}
                  </Text>
                </Box>
                <ChevronDown size={14} strokeWidth={2} color="#6b7280" />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Signed in as</Menu.Label>
            <Menu.Item leftSection={<UserIcon size={16} strokeWidth={1.75} />}>
              <Text fz="sm" fw={500}>
                {authUser.name}
              </Text>
              <Text fz="xs" c="gray.6">
                @{authUser.username}
              </Text>
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
              color="red"
              leftSection={<LogOut size={16} strokeWidth={1.75} />}
              onClick={() => AuthUtil.logout()}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
};
