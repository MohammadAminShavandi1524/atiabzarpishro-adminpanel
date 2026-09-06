"use client";

import Image from "next/image";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { CatalogueItem } from "./catalogues.api";

import { deleteCatalogue } from "./delete-catalogue.api";

import { useCatalogueRowAnimation } from "./useCatalogueRowAnimation";

import {
  CATALOGUES_TABLE_GRID,
  CATALOGUES_TABLE_INNER_PADDING,
} from "./cataloguesTableLayout";

interface CatalogueRowProps {
  catalogue: CatalogueItem;

  setCatalogues: Dispatch<SetStateAction<CatalogueItem[]>>;

  animationIndex?: number;
}

export default function CatalogueRow({
  catalogue,
  setCatalogues,
  animationIndex = 0,
}: CatalogueRowProps) {
  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const t = useTranslations("Catalogues");

  const rowRef = useRef<HTMLElement>(null);

  const formattedDate = formatDate(catalogue.created, locale);

  useCatalogueRowAnimation({
    rowRef,
    animationIndex,
  });

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
    <article
      ref={rowRef}
      className="group/catalogue border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative w-full border transition-[background-color,border-color] duration-300"
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/catalogue:scale-y-100" />

      <div
        className={`${CATALOGUES_TABLE_GRID} ${CATALOGUES_TABLE_INNER_PADDING} 3xl:min-h-[94px] 3xl:py-3 min-h-[94px] items-center py-3 xl:min-h-[82px] xl:py-2.5 2xl:min-h-[88px]`}
      >
        {/* ID */}
        <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
          {locale === "fa"
            ? `${englishToPersianNumber(String(catalogue.id))}#`
            : `#${catalogue.id}`}
        </div>

        {/* Catalogue Name */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
            {locale === "fa" ? catalogue.name_fa : catalogue.name_en}
          </p>

          <p
            lang={locale === "fa" ? "en" : "fa"}
            className="text-muted-foreground 3xl:mt-1 3xl:text-xs mt-1 truncate text-xs xl:mt-0.5 xl:text-[11px]"
          >
            {locale === "fa" ? catalogue.name_en : catalogue.name_fa}
          </p>
        </div>

        {/* Brand */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-sm truncate text-sm font-medium xl:text-[12px] 2xl:text-[13px]">
            {locale === "fa"
              ? catalogue.brand?.name_fa
              : catalogue.brand?.name_en}
          </p>

          <p
            lang={locale === "fa" ? "en" : "fa"}
            className="text-muted-foreground 3xl:mt-1 3xl:text-xs mt-1 truncate text-xs xl:mt-0.5 xl:text-[11px]"
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
          className="group/image 3xl:h-16 3xl:w-12 relative h-16 w-12 cursor-pointer overflow-hidden xl:h-14 xl:w-10 2xl:h-[60px] 2xl:w-11"
        >
          <Image
            src={catalogue.image}
            alt={catalogue.name_en}
            fill
            sizes="48px"
            className="object-cover transition-transform duration-300 group-hover/image:scale-105"
          />

          <span className="bg-background/75 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
            <Eye
              size={17}
              strokeWidth={1.8}
              className="text-foreground 3xl:size-[17px] xl:size-[15px]"
            />
          </span>
        </button>

        {/* Source */}
        <div className="min-w-0">
          <span className="bg-custom-primary/10 text-custom-primary inline-flex px-2.5 py-1 text-xs font-medium xl:px-2 xl:py-0.5 xl:text-[11px] 2xl:px-2.5 2xl:py-1 2xl:text-xs">
            {catalogue.object_storage ? t("source.upload") : t("source.url")}
          </span>
        </div>

        {/* Date */}
        <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
          {formattedDate}
        </div>

        {/* Actions */}
        <div className="3xl:gap-2 flex min-w-0 items-center justify-center gap-2 xl:gap-1.5">
          {/* Preview */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={handlePreview}
            disabled={!catalogue.url}
            leftSection={
              <ExternalLink
                size={16}
                strokeWidth={1.8}
                className="3xl:size-4 xl:size-[14px]"
              />
            }
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
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
            leftSection={
              <Pencil
                size={16}
                strokeWidth={1.8}
                className="3xl:size-4 xl:size-[14px]"
              />
            }
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
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
            leftSection={
              <Trash2
                size={16}
                strokeWidth={1.8}
                className="3xl:size-4 xl:size-[14px]"
              />
            }
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
}
