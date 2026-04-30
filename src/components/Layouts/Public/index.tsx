import { AppShell, Paper, Stack } from "@mantine/core";
import { type FC } from "react";
import { Outlet } from "react-router-dom";

export const PublicLayout: FC = () => {
  return (
    <AppShell
      style={{
        background:
          "radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--mantine-primary-color-filled) 12%, transparent) 0%, transparent 70%), light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))",
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
          <Paper
            p={40}
            radius="lg"
            withBorder
            style={{
              background: "var(--mantine-color-body)",
              borderColor:
                "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
              boxShadow:
                "0 20px 60px -12px rgba(0, 0, 0, 0.12), 0 8px 24px -8px rgba(0, 0, 0, 0.06)",
            }}
          >
            <Outlet />
          </Paper>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
