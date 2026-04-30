import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { RefreshCwIcon } from "lucide-react";
import { type FC, useState } from "react";
import { formatTimestamp } from "@/utils/DateUtil";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";
import classes from "./RefreshButton.module.css";

type Props = {
  onClick: () => void | Promise<void> | Promise<boolean>;
};

export const RefreshButton: FC<Props> = ({ onClick }) => {
  const t = useTranslation();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async (): Promise<void> => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    const result = await onClick();
    if (result !== false) {
      setLastUpdated(new Date());
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsRefreshing(false);
  };

  return (
    <Group gap="sm" onClick={handleClick} className={classes.buttonWrapper}>
      <ActionIcon size="38px" variant="light" color="blue" radius="md">
        <RefreshCwIcon size={18} className={isRefreshing ? classes.spin : ""} />
      </ActionIcon>
      <Box>
        <Text variant="body3" fw={600} c="dark.3">
          {t(tBasic.textRefreshData)}
        </Text>
        <Text variant="caption1" c="dimmed">
          {formatTimestamp(lastUpdated)}
        </Text>
      </Box>
    </Group>
  );
};
