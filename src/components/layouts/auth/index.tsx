import { useEffect, type FC } from "react";
import { $authUser } from "@/stores/auth-user-store";
import { useStore } from "@nanostores/react";
import { useDisclosure } from "@mantine/hooks";
import { useSidebarToggle } from "./hooks/use-sidebar-toggle";
import { useWatchLocalStorage } from "@/hooks/local-storage/use-watch-local-storage";
import { LOCAL_STORAGE_KEYS } from "@/consts/keys/local-storage-keys";
import { $debugMode } from "@/stores/debug-mode-store";
import { LocalStorageUtil } from "@/utils/local-storage-util";
import { TokenTimerUtil } from "@/utils/token-timer-util";
import { AuthUtil } from "@/utils/auth-util";
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import { AppHeader } from "./components/app-header";

export const AuthLayout: FC = () => {
  const authUser = useStore($authUser);
  const debugMode = useStore($debugMode);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const checkedAuth = debugMode || !!authUser;

  // Add keyboard shortcut for toggling sidebar (Ctrl+B)
  useSidebarToggle(toggleDesktop);

  useWatchLocalStorage(LOCAL_STORAGE_KEYS.AUTH_USER, () => {
    if (debugMode) return;

    const authUser = LocalStorageUtil.loadAuthUser();
    // auto logout if authUser is removed from localStorage (e.g., in another tab)
    if (!authUser || authUser.refresh_token_exp <= Date.now() / 1000) {
      $authUser.set(null);
      return;
    }

    $authUser.set(authUser);
    TokenTimerUtil.startTimer(
      authUser.access_token_exp,
      authUser.refresh_token_exp,
    );
  });

  useEffect(() => {
    if (debugMode) {
      console.log("[DEBUG MODE] Auth check bypassed");
      return;
    }

    if (!authUser) {
      AuthUtil.logout();
      return;
    }

    if (authUser.refresh_token_exp < Date.now() / 1000) {
      AuthUtil.logout();
      return;
    }

    TokenTimerUtil.startTimer(
      authUser.access_token_exp,
      authUser.refresh_token_exp,
    );

    let timerId: number | null = null;

    if (!authUser.remember_me) {
      const timeUntilExp = authUser.refresh_token_exp * 1000 - Date.now();

      if (timeUntilExp <= 0) {
        AuthUtil.logout();
        return;
      }

      timerId = setTimeout(() => {
        AuthUtil.logout();
      }, timeUntilExp);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [debugMode, authUser]);

  if (!checkedAuth) return <></>;

  return (
    <AppShell
      layout="alt"
      header={{ height: 64 }}
      navbar={{
        width: desktopOpened ? 260 : 76,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      bg="#f5f6fa"
      padding="md"
    >
      <AppShell.Header>
        <AppHeader mobileOpened={mobileOpened} toggleMobile={toggleMobile} />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppSidebar collapsed={!desktopOpened} onToggle={toggleDesktop} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
