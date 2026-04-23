import { Paper, type PaperProps } from "@mantine/core";
import type { FC, ReactNode } from "react";

type Props = Omit<PaperProps, "withBorder" | "radius" | "bg" | "style"> & {
  children: ReactNode;
  padding?: PaperProps["p"];
};

/**
 * Standard white surface card with subtle border.
 * Use for panels on dashboards, report sections, stat tiles.
 */
export const SurfaceCard: FC<Props> = ({ children, padding = "lg", ...rest }) => (
  <Paper
    {...rest}
    withBorder
    radius="md"
    p={padding}
    bg="white"
    style={{ borderColor: "var(--mantine-color-gray-2)" }}
  >
    {children}
  </Paper>
);
