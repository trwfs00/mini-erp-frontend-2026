import type { Language } from "@/types/language/Language";

export type BreadcrumbItem = {
  label: Record<Language, string>;
  path?: string;
};
