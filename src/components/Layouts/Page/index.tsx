import {
  Container,
  Stack,
  type ContainerProps,
  type StackProps,
} from "@mantine/core";
import type { FC, ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AppLoadingOverlay } from "@/components/AppLoadingOverlay";
import type { BreadcrumbItem } from "@/types/Global";

type Props = {
  variant?: "stack" | "fluid";
  breadcrumbs?: BreadcrumbItem | BreadcrumbItem[];
  children?: ReactNode;
  size?: ContainerProps["size"];
  containerProps?: ContainerProps;
  stackProps?: StackProps;
  isLoading?: boolean;
};

export const PageLayout: FC<Props> = ({
  variant = "stack",
  breadcrumbs,
  children,
  size = "xl",
  containerProps,
  stackProps,
  isLoading = false,
}) => {
  return (
    <Container
      size={size}
      py="md"
      pos="relative"
      mih="calc(100vh - 120px)"
      {...containerProps}
    >
      <AppLoadingOverlay visible={isLoading} />
      <Stack gap="lg" {...stackProps}>
        {breadcrumbs && <Breadcrumb current={breadcrumbs} />}
        {variant === "stack" && <Stack gap="lg">{children}</Stack>}
        {variant === "fluid" && children}
      </Stack>
    </Container>
  );
};
