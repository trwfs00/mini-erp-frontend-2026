import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { MoonStar, SunMedium } from "lucide-react";
import classes from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tooltip
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      position="bottom"
      withArrow
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        radius="xl"
        onClick={toggleColorScheme}
        aria-label="Toggle color scheme"
        className={classes.button}
      >
        <span className={classes.iconWrap}>
          <SunMedium
            size={18}
            strokeWidth={2}
            className={`${classes.icon} ${classes.sun}`}
          />
          <MoonStar
            size={18}
            strokeWidth={2}
            className={`${classes.icon} ${classes.moon}`}
          />
        </span>
      </ActionIcon>
    </Tooltip>
  );
};
