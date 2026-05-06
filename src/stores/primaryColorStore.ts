import { atom } from "nanostores";
import {
  type AccentColor,
  DEFAULT_ACCENT,
  ACCENT_COLORS,
} from "@/consts/theme/accentColors";
import { LOCAL_STORAGE_KEYS } from "@/consts/keys/localStorageKeys";

const isAccentColor = (value: string): value is AccentColor =>
  ACCENT_COLORS.some((c) => c.value === value);

const loadInitial = (): AccentColor => {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEYS.PRIMARY_COLOR);
  return stored && isAccentColor(stored) ? stored : DEFAULT_ACCENT;
};

export const $primaryColor = atom<AccentColor>(loadInitial());

export const setPrimaryColor = (color: AccentColor) => {
  $primaryColor.set(color);
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.PRIMARY_COLOR, color);
};
