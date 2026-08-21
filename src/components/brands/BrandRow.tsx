"use client";

import Image from "next/image";

import type { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { Eye, FileText, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "../ui/custom-toast";

import type { Brand } from "./brands.api";
import { deleteBrand } from "./delete-brand.api";

interface BrandRowProps {
  brand: Brand;

  setBrands: Dispatch<SetStateAction<Brand[]>>;
}

export default function BrandRow({ brand, setBrands }: BrandRowProps) {
  const locale = useLocale();
  const router = useRouter();
  const toast = useCustomToast();

  const t = useTranslations("Brands");

  const formattedDate = formatDate(brand.created, locale);

  const handleDelete = async () => {
    try {
      await deleteBrand(brand.id);

      setBrands((prev) => prev.filter((item) => item.id !== brand.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE BRAND ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  const handleViewImage = () => {
    window.open(brand.image, "_blank", "noopener,noreferrer");
  };

  const handleViewCatalog = () => {
    window.open(brand.catalog, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group/brand border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300">
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/brand:scale-y-100" />

      <div className="grid min-h-[94px] grid-cols-[60px_1fr_110px_1.55fr_1.55fr_135px_310px] items-center gap-5 px-5 py-3">
        {/* ID */}
        <div className="text-muted-foreground text-sm">
          {locale === "fa"
            ? `${englishToPersianNumber(String(brand.id))}#`
            : `#${brand.id}`}
        </div>

        {/* Name */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-[15px] font-medium">
            {brand.name_en}
          </p>
        </div>

        {/* Image */}
        <button
          type="button"
          onClick={handleViewImage}
          aria-label={t("actions.viewImage")}
          className="group/image relative size-14 cursor-pointer overflow-hidden"
        >
          <Image
            src={brand.image}
            alt={brand.name_en}
            fill
            sizes="56px"
            className="object-contain transition-transform duration-300 group-hover/image:scale-105"
          />

          <span className="bg-background/75 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
            <Eye size={18} strokeWidth={1.8} className="text-foreground" />
          </span>
        </button>

        {/* Description EN */}
        <div className="min-w-0">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
            {brand.description_en}
          </p>
        </div>

        {/* Description FA */}
        <div className="min-w-0">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
            {brand.description_fa}
          </p>
        </div>

        {/* Date */}
        <div className="text-muted-foreground text-sm">{formattedDate}</div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* View Catalog */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={handleViewCatalog}
            leftSection={<FileText size={16} strokeWidth={1.8} />}
            className="h-9 px-3 text-sm"
          >
            {t("actions.viewCatalog")}
          </CustomButton>

          {/* Edit */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={() => {
              router.push(`/${locale}/brands/${brand.id}/edit`);
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
