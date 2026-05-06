import { $language } from "@/stores/languageStore";
import { type Language } from "@/types/language/Language";
import { useStore } from "@nanostores/react";

// WARNING ใช้เฉพาะใน component
// ข้างนอกไปใช้ util แทน src/utils/LanguageUtil.ts (getText)
export function useTranslation() {
  const language = useStore($language);

  const t = (record: Record<Language, string>): string => {
    return record[language];
  };

  return t;
}
