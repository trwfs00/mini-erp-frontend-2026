import { createTheme, Modal, Text, Title } from "@mantine/core";
import typographyClasses from "./Typography.module.css";
import modalClasses from "./Modal.module.css";

export const theme = createTheme({
  components: {
    Text: Text.extend({
      classNames: typographyClasses,
    }),
    Title: Title.extend({
      classNames: typographyClasses,
    }),
    Modal: Modal.extend({
      classNames: modalClasses,
      defaultProps: {
        centered: true,
        radius: "lg",
        overlayProps: { backgroundOpacity: 0.45, blur: 2 },
        transitionProps: { transition: "pop", duration: 180 },
      },
    }),
  },
});
