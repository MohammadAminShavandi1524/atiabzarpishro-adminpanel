"use client";

import Image from "next/image";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { TechNewsItem } from "./technews.api";

import { deleteTechNews } from "./delete-technews.api";

import { useTechNewsRowAnimation } from "./useTechNewsRowAnimation";

import {
  TECH_NEWS_TABLE_GRID,
  TECH_NEWS_TABLE_INNER_PADDING,
} from "./techNewsTableLayout";

interface TechNewsRowProps {
  item: TechNewsItem;

  setItems: Dispatch<SetStateAction<TechNewsItem[]>>;

  animationIndex?: number;
}

export default function TechNewsRow({
  item,
  setItems,
  animationIndex = 0,
}: TechNewsRowProps) {
  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const t = useTranslations("TechNews");

  const rowRef = useRef<HTMLElement>(null);

  useTechNewsRowAnimation({
    rowRef,
    animationIndex,
  });

  const handleDelete = async () => {
    try {
      await deleteTechNews(item.id);

      setItems((prev) => prev.filter((current) => current.id !== item.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE TECH NEWS ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  const handleViewImage = () => {
    window.open(item.image, "_blank", "noopener,noreferrer");
  };

  const handlePreview = () => {
    if (!item.url) {
      return;
    }

    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      ref={rowRef}
      className="group/technews border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative w-full border transition-[background-color,border-color] duration-300"
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/technews:scale-y-100" />

      <div
        className={`${TECH_NEWS_TABLE_GRID} ${TECH_NEWS_TABLE_INNER_PADDING} 3xl:min-h-[94px] 3xl:py-3 min-h-[94px] items-center py-3 xl:min-h-[82px] xl:py-2.5 2xl:min-h-[88px]`}
      >
        {/* ID */}
        <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
          {locale === "fa"
            ? `${englishToPersianNumber(String(item.id))}#`
            : `#${item.id}`}
        </div>

        {/* Name EN */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
            {item.name_en}
          </p>
        </div>

        {/* Name FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]"
          >
            {item.name_fa}
          </p>
        </div>

        {/* Image */}
        <button
          type="button"
          onClick={handleViewImage}
          aria-label={t("actions.viewImage")}
          className="group/image 3xl:h-16 3xl:w-12 relative h-16 w-12 cursor-pointer overflow-hidden xl:h-14 xl:w-10 2xl:h-[60px] 2xl:w-11"
        >
          <Image
            src={item.image}
            alt={item.name_en}
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
          <span
            className={
              item.object_storage
                ? "bg-custom-primary/10 text-custom-primary inline-flex px-2.5 py-1 text-xs font-medium xl:px-2 xl:py-0.5 xl:text-[11px] 2xl:px-2.5 2xl:py-1 2xl:text-xs"
                : "bg-card-secondary text-muted-foreground inline-flex px-2.5 py-1 text-xs font-medium xl:px-2 xl:py-0.5 xl:text-[11px] 2xl:px-2.5 2xl:py-1 2xl:text-xs"
            }
          >
            {item.object_storage ? t("source.upload") : t("source.url")}
          </span>
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
            disabled={!item.url}
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
              router.push(`/${locale}/technews/${item.id}/edit`);
            }}
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
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
}
