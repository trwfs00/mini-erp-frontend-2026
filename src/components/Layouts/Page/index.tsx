import { Center, Container, Loader, type ContainerProps } from "@mantine/core";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: ContainerProps["size"];
  isLoading?: boolean;
};

export const PageLayout = ({ children, size = "xl", isLoading }: Props) => {
  return (
    <Container size={size} py="md">
      {isLoading ? (
        <Center mih={400}>
          <Loader size="lg" />
        </Center>
      ) : (
        children
      )}
    </Container>
  );
};
