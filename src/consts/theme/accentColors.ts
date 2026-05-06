export type AccentColor =
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "grape"
  | "violet";

export const ACCENT_COLORS: {
  value: AccentColor;
  label: string;
  pair: string;
}[] = [
  { value: "indigo", label: "Indigo", pair: "violet" },
  { value: "blue", label: "Blue", pair: "cyan" },
  { value: "cyan", label: "Cyan", pair: "teal" },
  { value: "teal", label: "Teal", pair: "green" },
  { value: "green", label: "Green", pair: "lime" },
  { value: "yellow", label: "Yellow", pair: "orange" },
  { value: "orange", label: "Orange", pair: "red" },
  { value: "red", label: "Red", pair: "pink" },
  { value: "pink", label: "Pink", pair: "grape" },
  { value: "grape", label: "Grape", pair: "violet" },
  { value: "violet", label: "Violet", pair: "indigo" },
];

export const DEFAULT_ACCENT: AccentColor = "blue";

export const getAccentPair = (color: AccentColor): string =>
  ACCENT_COLORS.find((c) => c.value === color)?.pair ?? "violet";
