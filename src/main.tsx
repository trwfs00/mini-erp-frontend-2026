// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "mantine-datatable/styles.css";
import "@mantine/notifications/styles.layer.css";
import App from "./App.tsx";
import { LocalStorageUtil } from "@/utils/LocalStorageUtil.ts";
import { $authUser } from "@/stores/authUserStore.ts";

const authUser = LocalStorageUtil.loadAuthUser();
if (authUser && authUser.refresh_token_exp >= Date.now() / 1000) {
  $authUser.set(authUser);
} else {
  LocalStorageUtil.deleteAuthUser();
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
