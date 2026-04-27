import { createTheme, Text, Title } from '@mantine/core';
import typographyClasses from './Typography.module.css';

export const theme = createTheme({
  components: {
    Text: Text.extend({
      classNames: typographyClasses,
    }),
    Title: Title.extend({
      classNames: typographyClasses,
    }),
  },
});
