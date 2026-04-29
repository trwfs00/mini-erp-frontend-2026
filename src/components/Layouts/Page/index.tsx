import {
  Container,
  LoadingOverlay,
  Stack,
  type ContainerProps,
  type StackProps,
} from "@mantine/core";
import type { FC, ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { BreadcrumbItem } from "@/types/Global";

type Props = {
  variant?: "stack" | "fluid";
  breadcrumbs?: BreadcrumbItem | BreadcrumbItem[];
  children?: ReactNode;
  isLoading?: boolean;
  size?: ContainerProps["size"];
  containerProps?: ContainerProps;
  stackProps?: StackProps;
};

export const PageLayout: FC<Props> = ({
  variant = "stack",
  breadcrumbs,
  children,
  isLoading,
  size = "xl",
  containerProps,
  stackProps,
}) => {
  return (
    <Container
      size={size}
      py="md"
      pos="relative"
      mih="calc(100vh - 120px)"
      {...containerProps}
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={50}
        overlayProps={{ blur: 1, backgroundOpacity: 0 }}
        loaderProps={{ type: "oval", size: "lg" }}
      />
      <Stack gap="lg" {...stackProps}>
        {breadcrumbs && <Breadcrumb current={breadcrumbs} />}
        {variant === "stack" && <Stack gap="lg">{children}</Stack>}
        {variant === "fluid" && children}
      </Stack>
    </Container>
  );
};
