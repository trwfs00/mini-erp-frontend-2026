// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
import App from "./App.tsx";
import { LocalStorageUtil } from "@/utils/local-storage-util";
import { $authUser } from "@/stores/auth-user-store";
import { DebugModeUtil } from "@/utils/debug-mode-util";

interface WindowWithDebug extends Window {
  enableDebug: (enable: boolean) => void;
}

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
(window as unknown as WindowWithDebug).enableDebug = (enable: boolean) => {
  DebugModeUtil.enable(enable);
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
