import { useEffect } from "react";
import { spotlight } from "@mantine/spotlight";

export const useCommandPaletteToggle = () => {
  useEffect(() => {
    // Capture-phase listener fires before Spotlight's internal handler,
    // so Cmd+K works whether the palette is open or closed.
    const handler = (event: KeyboardEvent) => {
      // Check for Ctrl+K (or Cmd+K on Mac)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        spotlight.toggle();
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () =>
      window.removeEventListener("keydown", handler, { capture: true });
  }, []);
};
