import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import {
  MantineProvider,
  localStorageColorSchemeManager,
  mergeMantineTheme,
  DEFAULT_THEME,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useStore } from "@nanostores/react";
import { theme } from "./consts/theme";
import { $primaryColor } from "@/stores/primaryColorStore";
import { LOCAL_STORAGE_KEYS } from "@/consts/keys/localStorageKeys";
import "./styles/global.css";

const colorSchemeManager = localStorageColorSchemeManager({
  key: LOCAL_STORAGE_KEYS.COLOR_SCHEME,
});

function App() {
  const primaryColor = useStore($primaryColor);

  const mergedTheme = mergeMantineTheme(DEFAULT_THEME, {
    ...theme,
    primaryColor,
  });

  return (
    <MantineProvider
      theme={mergedTheme}
      defaultColorScheme="auto"
      colorSchemeManager={colorSchemeManager}
    >
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
