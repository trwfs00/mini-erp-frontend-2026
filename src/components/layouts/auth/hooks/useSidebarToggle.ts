import { useWindowEvent } from "@mantine/hooks";
import { useCallback } from "react";

export const useSidebarToggle = (toggleSidebar: () => void) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for Ctrl+B (or Cmd+B on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    },
    [toggleSidebar],
  );

  useWindowEvent("keydown", handleKeyDown);
};
