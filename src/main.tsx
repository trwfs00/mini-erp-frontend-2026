// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "mantine-datatable/styles.css";
import "@mantine/notifications/styles.layer.css";
import App from "./App.tsx";
import { LocalStorageUtil } from "@/utils/LocalStorageUtil.ts";
import { $authUser } from "@/stores/authUserStore.ts";
import { DebugModeUtil } from "@/utils/DebugModeUtil.ts";

type WindowWithDebug = Window & {
  enableAuthBypass: (enable: boolean) => void;
  enableMock: (enable: boolean) => void;
  enableBypassAll: (enable: boolean) => void;
};

// Initialize from localStorage on app load
const authUser = LocalStorageUtil.loadAuthUser();
if (authUser && authUser.refresh_token_exp >= Date.now() / 1000) {
  $authUser.set(authUser);
} else {
  LocalStorageUtil.deleteAuthUser();
}

// Initialize debug mode from sessionStorage
DebugModeUtil.initialize();

// Register backdoor debugging
const debugWindow = window as unknown as WindowWithDebug;
debugWindow.enableAuthBypass = (enable: boolean) => {
  DebugModeUtil.enableAuthBypass(enable);
};
debugWindow.enableMock = (enable: boolean) => {
  DebugModeUtil.enableMock(enable);
};
debugWindow.enableBypassAll = (enable: boolean) => {
  DebugModeUtil.enableBypassAll(enable);
};

// Log debug mode instructions in development
if (import.meta.env.DEV) {
  DebugModeUtil.logInstructions();
}
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
