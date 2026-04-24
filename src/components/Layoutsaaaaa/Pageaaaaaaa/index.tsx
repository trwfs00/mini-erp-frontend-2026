import { Container, type ContainerProps } from "@mantine/core";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: ContainerProps["size"];
};

export const PageLayout = ({ children, size = "xl" }: Props) => {
  return (
    <Container size={size} py="md">
      {children}
    </Container>
  );
};
