import { AppShell, Paper, Stack } from "@mantine/core";
import { type FC } from "react";
import { Outlet } from "react-router-dom";

export const PublicLayout: FC = () => {
  return (
    <AppShell
      style={{
        backgroundColor: "light-dark(#f0f2f5, var(--mantine-color-dark-8))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AppShell.Main>
        <Stack
          justify="center"
          align="center"
          h="100vh"
          mih={720}
          style={{ overflowY: "auto" }}
        >
          <Paper shadow="md" p={40} radius={10}>
            <Outlet />
          </Paper>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
