import { useWindowEvent } from "@mantine/hooks";

export const useSidebarToggle = (toggleSidebar: () => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Check for Ctrl+B (or Cmd+B on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      toggleSidebar();
    }
  };

  useWindowEvent("keydown", handleKeyDown);
};
