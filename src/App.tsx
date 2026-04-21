import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { MantineProvider } from "@mantine/core";
import "./styles/global.css";

function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
