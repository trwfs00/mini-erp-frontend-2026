import { $language } from "@/stores/languageStore";
import type { Language } from "@/types/language/Language";

export const LanguageUtil = {
  // ดึงภาษานอก component
  getText(record: Record<Language, string>): string {
    const language = $language.get();
    return record[language];
  },
};
