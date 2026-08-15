"use client";

import { useTranslations } from "next-intl";

import CustomSelect from "@/components/ui/custom-select/CustomSelect";

interface LanguageSelectProps {
  value: "fa" | "en";
  onChange: (value: "fa" | "en") => void;
}

const LanguageSelect = ({ value, onChange }: LanguageSelectProps) => {
  const t = useTranslations("addNews");

  return (
    <CustomSelect<"fa" | "en">
      label={t("forms.parentNews.language")}
      value={value}
      onChange={onChange}
      options={[
        {
          label: t("languages.fa"),
          value: "fa",
        },
        {
          label: t("languages.en"),
          value: "en",
        },
      ]}
    />
  );
};

export default LanguageSelect;
