import { $language } from "@/stores/languageStore";
import { Avatar, UnstyledButton } from "@mantine/core";
import { useStore } from "@nanostores/react";
import type { FC } from "react";

export const LanguageButton: FC = () => {
  const language = useStore($language);

  const handleToggleLanguage = (): void => {
    $language.set(language === "th" ? "en" : "th");
  };

  return (
    <UnstyledButton
      onClick={handleToggleLanguage}
      style={{ cursor: "pointer" }}
    >
      <Avatar radius="xl" size={32} variant="filled" color="gray">
        {language === "th" ? "TH" : "EN"}
      </Avatar>
    </UnstyledButton>
  );
};
