"use client";

import { useLocale, useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import CategoryRow from "./CategoryRow";

interface Category {
  id: number;
  name: string;
  lang: "fa" | "en";
}

interface CategoriesSectionProps {
  categories: Category[];
  onDelete: (id: number) => void;
}

const CategoriesSection = ({
  categories,
  onDelete,
}: CategoriesSectionProps) => {
  const t = useTranslations("news");
  const locale = useLocale();

  return (
    <section className="border-border-secondary bg-secondary-bg relative flex h-full flex-col overflow-hidden border">
      {/* Table header */}
      <div className="border-border-secondary bg-tertiary border-b px-10">
        <div className="text-muted-foreground grid h-14 grid-cols-4 items-center text-xs font-medium tracking-[0.04em]">
          <div>{t("categories.table.id")}</div>

          <div>{t("categories.table.name")}</div>

          <div>{t("categories.table.language")}</div>

          <div>{t("categories.table.actions")}</div>
        </div>
      </div>

      {/* Table body */}
      <div className="min-h-0 flex-1">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="h-full w-full"
        >
          <div className="px-6 pb-6 pt-4">
            {categories.map((item) => (
              <CategoryRow
                key={`${item.lang}-${item.id}`}
                id={String(item.id)}
                label={item.name}
                lang={item.lang}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};

export default CategoriesSection;
