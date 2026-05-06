import { type Language } from "@/types/language/Language";
import { atom } from "nanostores";

export const $language = atom<Language>("th");
