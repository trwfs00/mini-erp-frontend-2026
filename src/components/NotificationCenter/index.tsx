import {
  ActionIcon,
  Box,
  Group,
  Indicator,
  Menu,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Info,
  Trash2,
  XCircle,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import {
  $notificationHistory,
  clearAllNotifications,
  markAllRead,
  markRead,
} from "@/stores/notificationHistoryStore";
import type {
  NotificationItem,
  NotificationType,
} from "@/types/notification/Notification";
import classes from "./NotificationCenter.module.css";

const TYPE_META: Record<
  NotificationType,
  { color: string; icon: typeof CheckCircle2 }
> = {
  success: { color: "var(--mantine-color-teal-6)", icon: CheckCircle2 },
  error: { color: "var(--mantine-color-red-6)", icon: XCircle },
  info: { color: "var(--mantine-color-blue-6)", icon: Info },
  warning: { color: "var(--mantine-color-yellow-6)", icon: AlertTriangle },
};

const formatRelative = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  if (sec < 30) return "Just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

const Row = ({ item }: { item: NotificationItem }) => {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  return (
    <UnstyledButton
      onClick={() => markRead(item.id)}
      className={classes.row}
      data-unread={!item.read || undefined}
    >
      <Box className={classes.iconWrap} style={{ color: meta.color }}>
        <Icon size={18} strokeWidth={2.25} />
      </Box>
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Group gap={6} wrap="nowrap" justify="space-between">
          <Text fz="sm" fw={600} truncate>
            {item.title}
          </Text>
          <Text fz="xs" c="dimmed" style={{ flexShrink: 0 }}>
            {formatRelative(item.timestamp)}
          </Text>
        </Group>
        {item.message && (
          <Text fz="xs" c="dimmed" lineClamp={2}>
            {item.message}
          </Text>
        )}
      </Stack>
      {!item.read && <span className={classes.unreadDot} />}
    </UnstyledButton>
  );
};

export const NotificationCenter = () => {
  const items = useStore($notificationHistory);
  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <Menu
      position="bottom-end"
      shadow="lg"
      width={360}
      offset={10}
      radius="md"
      transitionProps={{ transition: "pop-top-right", duration: 150 }}
      closeOnItemClick={false}
    >
      <Menu.Target>
        <Tooltip label="Notifications" position="bottom" withArrow>
          <Indicator
            color="red"
            size={16}
            offset={6}
            position="top-end"
            disabled={unreadCount === 0}
            label={unreadCount > 9 ? "9+" : unreadCount}
            withBorder
            styles={{ indicator: { fontSize: 10, fontWeight: 700 } }}
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="xl"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={2} />
            </ActionIcon>
          </Indicator>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown p={0} className={classes.dropdown}>
        <Group justify="space-between" px="md" py="sm" className={classes.header}>
          <Group gap={6}>
            <Text fw={700} fz="sm">
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text fz="xs" c="dimmed">
                · {unreadCount} unread
              </Text>
            )}
          </Group>
          <Group gap={4}>
            {unreadCount > 0 && (
              <Tooltip label="Mark all as read" withArrow>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  onClick={markAllRead}
                  aria-label="Mark all as read"
                >
                  <CheckCheck size={14} />
                </ActionIcon>
              </Tooltip>
            )}
            {items.length > 0 && (
              <Tooltip label="Clear all" withArrow>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  onClick={clearAllNotifications}
                  aria-label="Clear all"
                >
                  <Trash2 size={14} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>

        {items.length === 0 ? (
          <Stack align="center" gap={6} py={36} px="md">
            <Box className={classes.emptyIcon}>
              <BellOff size={26} strokeWidth={1.5} />
            </Box>
            <Text fz="sm" fw={600}>
              All caught up
            </Text>
            <Text fz="xs" c="dimmed" ta="center">
              You'll see new notifications here when they arrive
            </Text>
          </Stack>
        ) : (
          <ScrollArea.Autosize mah={420} type="hover" scrollbarSize={6}>
            <Stack gap={0}>
              {items.map((item) => (
                <Row key={item.id} item={item} />
              ))}
            </Stack>
          </ScrollArea.Autosize>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
