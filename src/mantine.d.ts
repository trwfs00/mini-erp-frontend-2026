import type { TextVariant } from "@mantine/core";

type CustomTextVariant =
  | TextVariant
  | "body1"
  | "body2"
  | "body3"
  | "body4"
  | "caption1"
  | "caption2";

type CustomTitleVariant = "heading" | "sub-heading";

declare module "@mantine/core" {
  export interface TextProps {
    variant?: CustomTextVariant;
  }
  export interface TitleProps {
    variant?: CustomTitleVariant;
  }
}
