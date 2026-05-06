import { useEffect, type FC } from "react";
import { $authUser } from "@/stores/authUserStore";
import { useStore } from "@nanostores/react";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { useSidebarToggle } from "./hooks/useSidebarToggle";
import { useWatchLocalStorage } from "@/hooks/localStorage/useWatchLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/consts/keys/localStorageKeys";
import { LocalStorageUtil } from "@/utils/LocalStorageUtil";
import { TokenTimerUtil } from "@/utils/TokenTimerUtil";
import { AuthUtil } from "@/utils/AuthUtil";
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { AppHeader } from "./components/AppHeader";
import { CommandPalette } from "@/components/CommandPalette";

export const AuthLayout: FC = () => {
  const authUser = useStore($authUser);
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
  const [desktopOpened, setDesktopOpened] = useLocalStorage<boolean>({
    key: LOCAL_STORAGE_KEYS.SIDEBAR_OPEN,
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const toggleDesktop = () => setDesktopOpened((v) => !v);
  const isMobile = useMediaQuery("(max-width: 48em)");

  const checkedAuth = !!authUser;

  useSidebarToggle(toggleDesktop);

  useWatchLocalStorage(LOCAL_STORAGE_KEYS.AUTH_USER, () => {
    const authUser = LocalStorageUtil.loadAuthUser();
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
  }, [authUser]);

  if (!checkedAuth) return <></>;

  return (
    <AppShell
      layout="alt"
      header={{ height: 56 }}
      navbar={{
        width: desktopOpened ? 260 : 76,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))"
      padding="md"
    >
      <AppShell.Header>
        <AppHeader mobileOpened={mobileOpened} toggleMobile={toggleMobile} />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppSidebar
          collapsed={!isMobile && !desktopOpened}
          onToggle={isMobile ? closeMobile : toggleDesktop}
          isMobile={isMobile}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <CommandPalette />
    </AppShell>
  );
};
