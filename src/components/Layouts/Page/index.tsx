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
    <Stack gap="lg" {...stackProps}>
      <Breadcrumb current={breadcrumbs} />
      <Container
        size={size}
        w="100%"
        py="md"
        pos="relative"
        {...containerProps}
      >
        <LoadingOverlay visible={isLoading} />
        {variant === "stack" && <Stack gap="lg">{children}</Stack>}
        {variant === "fluid" && children}
      </Container>
    </Stack>
  );
};
