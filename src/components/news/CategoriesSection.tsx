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
    <section className="border-border-secondary bg-secondary-bg relative flex h-full max-h-full min-h-0 w-full flex-1 flex-col overflow-hidden border">
      {/* Table Header */}
      <div className="border-border-secondary bg-tertiary 3xl:px-10 shrink-0 border-b px-10 xl:px-5 2xl:px-7">
        <div className="text-muted-foreground 3xl:h-14 grid h-14 grid-cols-4 items-center text-xs font-medium tracking-[0.04em] xl:h-11 xl:text-[11px] 2xl:h-12 2xl:text-xs">
          <div>{t("categories.table.id")}</div>

          <div>{t("categories.table.name")}</div>

          <div>{t("categories.table.language")}</div>

          <div>{t("categories.table.actions")}</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="h-full min-h-0 w-full flex-1"
          scrollBarClassName="me-0"
        >
          <div className="3xl:px-6 3xl:pt-4 3xl:pb-6 w-full px-6 pt-4 pb-6 xl:px-4 xl:pt-3 xl:pb-4 2xl:px-5 2xl:pt-3.5 2xl:pb-5">
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
