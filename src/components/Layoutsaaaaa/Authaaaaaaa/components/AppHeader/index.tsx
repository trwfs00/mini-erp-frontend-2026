import type { FC } from "react";
import { Avatar, Box, Burger, Group, Text } from "@mantine/core";
import { useLocation, useMatches } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { $authUser } from "@/stores/authUserStore";
import { ROUTE_PATHS } from "@/router/routePaths";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { BreadcrumbItem } from "@/types/Global";

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
  const authUser = useStore($authUser);
  const { pathname } = useLocation();
  const matches = useMatches();

  const getCrumbs = (): BreadcrumbItem[] => {
    const baseCrumbs: BreadcrumbItem[] = [
      { label: "Home", path: ROUTE_PATHS.DASHBOARD },
    ];

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
        <Group gap={10} wrap="nowrap" px="xs" py={6}>
          <Box visibleFrom="sm" style={{ minWidth: 0, textAlign: "right" }}>
            <Text fz="sm" fw={600} c="gray.9" lh={1.2} truncate>
              {authUser.username}
            </Text>
            <Text fz="xs" c="gray.6" lh={1.2} truncate>
              @{authUser.username}
            </Text>
          </Box>
          <Avatar
            size={34}
            radius="xl"
            color="indigo"
            variant="gradient"
            gradient={{ from: "indigo", to: "violet", deg: 135 }}
          >
            {getInitials(authUser.username)}
          </Avatar>
        </Group>
      )}
    </Group>
  );
};
