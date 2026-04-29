import type { FC } from "react";
import { LoadingOverlay } from "@mantine/core";

type Props = {
  visible: boolean;
};

export const AppLoadingOverlay: FC<Props> = ({ visible }) => (
  <LoadingOverlay
    visible={visible}
    zIndex={50}
    overlayProps={{ blur: 1, backgroundOpacity: 0 }}
    loaderProps={{ type: "oval", size: "lg" }}
  />
);
