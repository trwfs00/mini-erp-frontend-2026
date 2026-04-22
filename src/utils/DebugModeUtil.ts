import { $debugMode } from "@/stores/debugModeStore";
import { SessionStorageUtil } from "./SessionStorageUtil";

export const DebugModeUtil = {
  initialize() {
    if (SessionStorageUtil.loadDebugMode()) {
      $debugMode.set(true);
      console.log("[DEBUG MODE] Restored from session - ENABLED");
    }
  },

  enable(enable: boolean) {
    $debugMode.set(enable);
    SessionStorageUtil.saveDebugMode(enable);
    console.log(
      `[DEBUG MODE] ${enable ? "ENABLED" : "DISABLED"} - Auth checks ${enable ? "bypassed" : "active"}`,
    );
    if (enable) {
      console.log(
        "[DEBUG MODE] Persisted to session - will survive page reloads",
      );
    }
  },

  logInstructions() {
    console.log(
      "%c🔧 Debug Mode Available",
      "color: #00D9FF; font-size: 14px; font-weight: bold;",
    );
    console.log(
      "%cType %cwindow.enableDebug(true)%c to bypass auth checks",
      "color: #888;",
      "color: #FFD700; font-weight: bold;",
      "color: #888;",
    );
    console.log(
      "%cType %cwindow.enableDebug(false)%c to re-enable auth checks",
      "color: #888;",
      "color: #FFD700; font-weight: bold;",
      "color: #888;",
    );
  },
};
