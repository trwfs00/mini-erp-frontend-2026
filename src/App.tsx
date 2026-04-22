import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { MantineProvider } from "@mantine/core";
import { theme } from "./consts/theme";
import "./styles/global.css";

function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
