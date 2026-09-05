"use client";

import Image from "next/image";

import type { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { CatalogueItem } from "./catalogues.api";

import { deleteCatalogue } from "./delete-catalogue.api";

interface CatalogueRowProps {
  catalogue: CatalogueItem;

  setCatalogues: Dispatch<SetStateAction<CatalogueItem[]>>;
}

export default function CatalogueRow({
  catalogue,
  setCatalogues,
}: CatalogueRowProps) {
  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const t = useTranslations("Catalogues");

  const formattedDate = formatDate(catalogue.created, locale);

  const handleDelete = async () => {
    try {
      await deleteCatalogue(catalogue.id);

      setCatalogues((prev) => prev.filter((item) => item.id !== catalogue.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE CATALOGUE ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  const handleViewImage = () => {
    window.open(catalogue.image, "_blank", "noopener,noreferrer");
  };

  const handlePreview = () => {
    if (!catalogue.url) {
      return;
    }

    window.open(catalogue.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group/catalogue border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300">
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/catalogue:scale-y-100" />

      <div className="grid min-h-[94px] grid-cols-[55px_1.4fr_1.2fr_90px_120px_140px_310px] items-center gap-4 px-5 py-3">
        {/* ID */}
        <div className="text-muted-foreground text-sm">
          {locale === "fa"
            ? `${englishToPersianNumber(String(catalogue.id))}#`
            : `#${catalogue.id}`}
        </div>

        {/* Catalogue Name */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-[15px] font-medium">
            {locale === "fa" ? catalogue.name_fa : catalogue.name_en}
          </p>

          <p
            lang={locale === "fa" ? "en" : "fa"}
            className="text-muted-foreground mt-1 truncate text-xs"
          >
            {locale === "fa" ? catalogue.name_en : catalogue.name_fa}
          </p>
        </div>

        {/* Brand */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">
            {locale === "fa"
              ? catalogue.brand?.name_fa
              : catalogue.brand?.name_en}
          </p>

          <p
            lang={locale === "fa" ? "en" : "fa"}
            className="text-muted-foreground mt-1 truncate text-xs"
          >
            {locale === "fa"
              ? catalogue.brand?.name_en
              : catalogue.brand?.name_fa}
          </p>
        </div>

        {/* Cover */}
        <button
          type="button"
          onClick={handleViewImage}
          aria-label={t("actions.viewImage")}
          className="group/image relative h-16 w-12 cursor-pointer overflow-hidden"
        >
          <Image
            src={catalogue.image}
            alt={catalogue.name_en}
            fill
            sizes="48px"
            className="object-cover transition-transform duration-300 group-hover/image:scale-105"
          />

          <span className="bg-background/75 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
            <Eye size={17} strokeWidth={1.8} className="text-foreground" />
          </span>
        </button>

        {/* Source */}
        <div>
          <span className="bg-custom-primary/10 text-custom-primary inline-flex px-2.5 py-1 text-xs font-medium">
            {catalogue.object_storage ? t("source.upload") : t("source.url")}
          </span>
        </div>

        {/* Date */}
        <div className="text-muted-foreground text-sm">{formattedDate}</div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* Preview */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={handlePreview}
            disabled={!catalogue.url}
            leftSection={<ExternalLink size={16} strokeWidth={1.8} />}
            className="h-9 px-3 text-sm"
          >
            {t("actions.preview")}
          </CustomButton>

          {/* Edit */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={() => {
              router.push(`/${locale}/catalogues/${catalogue.id}/edit`);
            }}
            leftSection={<Pencil size={16} strokeWidth={1.8} />}
            className="h-9 px-3 text-sm"
          >
            {t("actions.edit")}
          </CustomButton>

          {/* Delete */}
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            onComplete={handleDelete}
            leftSection={<Trash2 size={16} strokeWidth={1.8} />}
            className="h-9 px-3 text-sm"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
}
