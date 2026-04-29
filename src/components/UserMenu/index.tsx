import {
  Avatar,
  Badge,
  Box,
  ColorSwatch,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Check, LogOut, Monitor, MoonStar, SunMedium } from "lucide-react";
import { useStore } from "@nanostores/react";
import type { User } from "@/types/auth/User";
import { AuthUtil } from "@/utils/AuthUtil";
import { $primaryColor, setPrimaryColor } from "@/stores/primaryColorStore";
import { ACCENT_COLORS, getAccentPair } from "@/consts/theme/accentColors";
import classes from "./UserMenu.module.css";

const getInitials = (name?: string | null): string => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
};

type Props = {
  authUser: User;
};

export const UserMenu = ({ authUser }: Props) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const primaryColor = useStore($primaryColor);
  const pairColor = getAccentPair(primaryColor);

  return (
    <Menu
      position="bottom-end"
      shadow="lg"
      width={296}
      offset={10}
      radius="md"
      transitionProps={{ transition: "pop-top-right", duration: 160 }}
    >
      <Menu.Target>
        <UnstyledButton className={classes.trigger}>
          <Group gap={10} wrap="nowrap">
            <Box visibleFrom="sm" style={{ minWidth: 0, textAlign: "right" }}>
              <Text fz="sm" fw={600} lh={1.2} truncate>
                {authUser.username}
              </Text>
              <Text fz="xs" c="dimmed" lh={1.2} truncate>
                {authUser.role.name.toUpperCase()}
              </Text>
            </Box>
            <Avatar
              size={34}
              radius="xl"
              color={primaryColor}
              variant="gradient"
              gradient={{ from: primaryColor, to: pairColor, deg: 135 }}
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
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown p={0} className={classes.dropdown}>
        <div className={classes.banner}>
          <Group gap="sm" wrap="nowrap">
            <Avatar
              size={44}
              radius="xl"
              color={primaryColor}
              variant="gradient"
              gradient={{ from: primaryColor, to: pairColor, deg: 135 }}
              styles={{
                placeholder: { fontSize: 14, fontWeight: 700 },
              }}
            >
              {getInitials(authUser.username)}
            </Avatar>
            <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
              <Text fz="sm" fw={700} truncate>
                {authUser.username}
              </Text>
              <Badge
                size="xs"
                variant="light"
                radius="sm"
                color={primaryColor}
                styles={{ root: { width: "fit-content" } }}
              >
                {authUser.role.name}
              </Badge>
            </Stack>
          </Group>
        </div>

        <div className={classes.section}>
          <Text fz="xs" fw={700} c="dimmed" tt="uppercase" mb={8} lts={0.6}>
            Appearance
          </Text>
          <div className={classes.themeSwitch} role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={colorScheme === "light"}
              data-active={colorScheme === "light" || undefined}
              className={classes.themeOption}
              onClick={() => setColorScheme("light")}
            >
              <SunMedium size={14} strokeWidth={2} />
              Light
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={colorScheme === "dark"}
              data-active={colorScheme === "dark" || undefined}
              className={classes.themeOption}
              onClick={() => setColorScheme("dark")}
            >
              <MoonStar size={14} strokeWidth={2} />
              Dark
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={colorScheme === "auto"}
              data-active={colorScheme === "auto" || undefined}
              className={classes.themeOption}
              onClick={() => setColorScheme("auto")}
            >
              <Monitor size={14} strokeWidth={2} />
              Auto
            </button>
          </div>
        </div>

        <div className={classes.section}>
          <Text fz="xs" fw={700} c="dimmed" tt="uppercase" mb={10} lts={0.6}>
            Accent color
          </Text>
          <Group gap={8}>
            {ACCENT_COLORS.map((c) => {
              const selected = primaryColor === c.value;
              return (
                <ColorSwatch
                  key={c.value}
                  component="button"
                  type="button"
                  color={theme.colors[c.value][6]}
                  size={24}
                  radius="xl"
                  onClick={() => setPrimaryColor(c.value)}
                  className={`${classes.swatch} ${selected ? classes.swatchActive : ""}`}
                  aria-label={`Set accent to ${c.label}`}
                  title={c.label}
                >
                  {selected && <Check size={14} strokeWidth={3} color="#fff" />}
                </ColorSwatch>
              );
            })}
          </Group>
        </div>

        <Menu.Divider m={0} />

        <Menu.Item
          color="red"
          leftSection={<LogOut size={15} strokeWidth={2} />}
          onClick={() => AuthUtil.logout()}
          className={classes.logout}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
