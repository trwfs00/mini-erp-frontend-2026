import { $authBypass, $mockMode } from "@/stores/debugModeStore";
import { SessionStorageUtil } from "./SessionStorageUtil";

export const DebugModeUtil = {
  initialize() {
    if (SessionStorageUtil.loadAuthBypass()) {
      $authBypass.set(true);
      console.log("[AUTH BYPASS] Restored from session - ENABLED");
    }
    if (SessionStorageUtil.loadMockMode()) {
      $mockMode.set(true);
      console.log("[MOCK MODE] Restored from session - ENABLED");
    }
    if (SessionStorageUtil.loadBypassAll()) {
      $mockMode.set(true);
      $authBypass.set(true);
      console.log("[BYPASS ALL] Restored from session - ENABLED");
    }
  },

  enableAuthBypass(enable: boolean) {
    $authBypass.set(enable);
    SessionStorageUtil.saveAuthBypass(enable);
    console.log(
      `[AUTH BYPASS] ${enable ? "ENABLED" : "DISABLED"} - Auth checks ${enable ? "bypassed" : "active"}`,
    );
  },

  enableMock(enable: boolean) {
    $mockMode.set(enable);
    SessionStorageUtil.saveMockMode(enable);
    console.log(
      `[MOCK MODE] ${enable ? "ENABLED" : "DISABLED"} - Services return ${enable ? "mock data" : "real API responses"}`,
    );
  },

  enableBypassAll(enable: boolean) {
    $mockMode.set(enable);
    $authBypass.set(enable);
    SessionStorageUtil.saveBypassAll(enable);
    console.log(
      `[BYPASS ALL] ${enable ? "ENABLED" : "DISABLED"} - ${enable ? "all" : "normal"} mode`,
    );
  },

  logInstructions() {
    console.log(
      "%c🔧 Debug Toggles Available",
      "color: #00D9FF; font-size: 14px; font-weight: bold;",
    );
    console.log(
      "%cAuth bypass: %cwindow.enableAuthBypass(true|false)",
      "color: #888;",
      "color: #FFD700; font-weight: bold;",
    );
    console.log(
      "%cMock data:   %cwindow.enableMock(true|false)",
      "color: #888;",
      "color: #FFD700; font-weight: bold;",
    );
    console.log(
      "%cBypass all:   %cwindow.enableBypassAll(true|false)",
      "color: #888;",
      "color: #FFD700; font-weight: bold;",
    );
  },
};
