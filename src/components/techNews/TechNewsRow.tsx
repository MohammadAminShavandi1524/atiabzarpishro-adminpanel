"use client";

import Image from "next/image";

import type { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { TechNewsItem } from "./technews.api";

import { deleteTechNews } from "./delete-technews.api";

interface TechNewsRowProps {
  item: TechNewsItem;

  setItems: Dispatch<SetStateAction<TechNewsItem[]>>;
}

export default function TechNewsRow({ item, setItems }: TechNewsRowProps) {
  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const t = useTranslations("TechNews");

  const formattedDate = formatDate(item.created, locale);

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
    <article className="group/technews border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300">
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/technews:scale-y-100" />

      <div className="grid min-h-[94px] grid-cols-[60px_1.2fr_1.2fr_90px_125px_135px_300px] items-center gap-4 px-5 py-3">
        {/* ID */}
        <div className="text-muted-foreground text-sm">
          {locale === "fa"
            ? `${englishToPersianNumber(String(item.id))}#`
            : `#${item.id}`}
        </div>

        {/* Name EN */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-[15px] font-medium">
            {item.name_en}
          </p>
        </div>

        {/* Name FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground truncate text-[15px] font-medium"
          >
            {item.name_fa}
          </p>
        </div>

        {/* Image */}
        <button
          type="button"
          onClick={handleViewImage}
          aria-label={t("actions.viewImage")}
          className="group/image relative h-16 w-12 cursor-pointer overflow-hidden"
        >
          <Image
            src={item.image}
            alt={item.name_en}
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
          <span
            className={
              item.object_storage
                ? "bg-custom-primary/10 text-custom-primary inline-flex px-2.5 py-1 text-xs font-medium"
                : "bg-card-secondary text-muted-foreground inline-flex px-2.5 py-1 text-xs font-medium"
            }
          >
            {item.object_storage ? t("source.upload") : t("source.url")}
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
            disabled={!item.url}
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
              router.push(`/${locale}/technews/${item.id}/edit`);
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
