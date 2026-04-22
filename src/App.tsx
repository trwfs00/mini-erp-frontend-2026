import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "./consts/theme";
import "./styles/global.css";

function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
