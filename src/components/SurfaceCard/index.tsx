import { Paper, type PaperProps } from "@mantine/core";
import type { CSSProperties, FC, ReactNode } from "react";

type Props = Omit<PaperProps, "withBorder" | "radius" | "bg"> & {
  children: ReactNode;
  padding?: PaperProps["p"];
  style?: CSSProperties;
};

/**
 * Standard white surface card with subtle border.
 * Use for panels on dashboards, report sections, stat tiles.
 */
export const SurfaceCard: FC<Props> = ({
  children,
  padding = "lg",
  style,
  ...rest
}) => (
  <Paper
    {...rest}
    withBorder
    radius="md"
    p={padding}
    bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))"
    style={{
      borderColor:
        "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
      ...style,
    }}
  >
    {children}
  </Paper>
);
