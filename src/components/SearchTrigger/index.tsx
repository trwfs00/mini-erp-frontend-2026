import { UnstyledButton } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { Search } from "lucide-react";
import classes from "./SearchTrigger.module.css";

export const SearchTrigger = () => {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  return (
    <UnstyledButton
      className={classes.trigger}
      onClick={() => spotlight.open()}
      aria-label="Open command palette"
    >
      <Search size={14} className={classes.icon} />
      <span className={classes.label}>Search anything…</span>
      <span className={classes.shortcut}>{isMac ? "⌘ K" : "Ctrl K"}</span>
    </UnstyledButton>
  );
};
