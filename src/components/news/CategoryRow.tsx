"use client";

import Link from "next/link";

import { Edit, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "../ui/custom-button";
import { customButtonVariants } from "../ui/custom-button/custom-button-variants";

interface CategoryRowProps {
  id: string;
  label: string;
  lang: "fa" | "en";
  onDelete: () => void;
}

const CategoryRow = ({ id, label, lang, onDelete }: CategoryRowProps) => {
  const locale = useLocale();
  const t = useTranslations("news.actions");

  return (
    <div
      className={cn(
        "group border-border-secondary bg-secondary-bg relative mb-2 grid min-h-16 w-full grid-cols-4 items-center border px-4",
        "transition-[border-color,background-color] duration-200",
        "hover:border-custom-primary/25 hover:bg-foreground/[0.02]",
        "last:mb-0",
      )}
    >
      {/* ID */}
      <div className="text-muted-foreground font-mono text-sm">#{id}</div>

      {/* Category */}
      <div className="min-w-0 pe-4">
        <span
          className={cn(
            "text-foreground block truncate text-sm font-medium",
            lang === "fa" && "font-IRANYekanX",
          )}
        >
          {label}
        </span>
      </div>

      {/* Language */}
      <div>
        <span className="border-custom-primary/20 bg-custom-primary/[0.06] text-custom-primary inline-flex min-w-10 items-center justify-center border px-2.5 py-1 text-xs font-medium">
          {lang === "fa" ? "FA" : "EN"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <Link
          href={`/${locale}/news/categories/edit/${lang}/${id}`}
          className={cn(
            customButtonVariants({
              intent: "info",
              variant: "soft",
            }),
            "gap-1.5",
          )}
        >
          <Edit className="size-4" strokeWidth={1.7} />

          <span>{t("edit")}</span>
        </Link>

        <CustomHoldButton
          intent="destructive"
          variant="soft"
          duration={1200}
          onComplete={onDelete}
          className="group"
          leftSection={<Trash className="size-4" strokeWidth={1.7} />}
        >
          {t("delete")}
        </CustomHoldButton>
      </div>

      {/* Hover marker */}
      <span
        aria-hidden="true"
        className="bg-custom-primary absolute inset-y-3 start-0 w-[2px] scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
      />
    </div>
  );
};

export default CategoryRow;
