"use client";

import Image from "next/image";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ChevronDown, ChevronUp, Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { Product } from "./products.api";

import { deleteProduct } from "./delete-product.api";

import { increaseProductIndex, reduceProductIndex } from "./product-index.api";

import { useProductRowAnimation } from "./useProductRowAnimation";

interface ProductRowProps {
  product: Product;

  setProducts: Dispatch<SetStateAction<Product[]>>;

  refreshProducts: () => Promise<void>;

  animationIndex?: number;
}

export default function ProductRow({
  product,
  setProducts,
  refreshProducts,
  animationIndex = 0,
}: ProductRowProps) {
  const locale = useLocale();

  const t = useTranslations("Products");

  const router = useRouter();

  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  useProductRowAnimation({
    rowRef,
    animationIndex,
  });

  const handleDelete = async () => {
    try {
      await deleteProduct(String(product.id));

      setProducts((prev) => prev.filter((item) => item.id !== product.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  const handleIncreaseIndex = async () => {
    const result = await increaseProductIndex(product.id);

    if (!result.success) {
      if (result.message === "Category is at the last index") {
        toast.error(t("toast.order.lastIndex"));

        return;
      }

      toast.error(t("toast.order.error"));

      return;
    }

    await refreshProducts();
  };

  const handleReduceIndex = async () => {
    const result = await reduceProductIndex(product.id);

    if (!result.success) {
      if (result.message === "Category is at the first index") {
        toast.error(t("toast.order.firstIndex"));

        return;
      }

      toast.error(t("toast.order.error"));

      return;
    }

    await refreshProducts();
  };

  const handleViewImage = () => {
    window.open(product.image, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      ref={rowRef}
      className="group/product border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300"
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/product:scale-y-100" />

      <div className="3xl:min-h-[94px] 3xl:grid-cols-[70px_1fr_1fr_100px_1fr_1.4fr_1.4fr_260px] 3xl:gap-4 3xl:px-5 3xl:py-3 grid min-h-[94px] grid-cols-[70px_1fr_1fr_100px_1fr_1.4fr_1.4fr_260px] items-center gap-4 px-5 py-3 xl:min-h-[82px] xl:grid-cols-[52px_minmax(90px,1fr)_minmax(90px,1fr)_64px_minmax(90px,0.9fr)_minmax(120px,1.25fr)_minmax(120px,1.25fr)_170px] xl:gap-3 xl:px-4 xl:py-2.5 2xl:min-h-[88px] 2xl:grid-cols-[60px_minmax(100px,1fr)_minmax(100px,1fr)_80px_minmax(100px,0.9fr)_minmax(140px,1.3fr)_minmax(140px,1.3fr)_210px] 2xl:gap-3.5 2xl:px-4.5">
        {/* Index */}
        <div className="text-muted-foreground 3xl:text-sm text-sm font-medium xl:text-[12px] 2xl:text-[13px]">
          {locale === "fa"
            ? englishToPersianNumber(String(product.index))
            : product.index}
        </div>

        {/* Name EN */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
            {product.name_en}
          </p>
        </div>

        {/* Name FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]"
          >
            {product.name_fa}
          </p>
        </div>

        {/* Image */}
        <button
          type="button"
          onClick={handleViewImage}
          aria-label={t("actions.viewImage")}
          className="group/image 3xl:size-14 relative size-14 cursor-pointer overflow-hidden xl:size-11 2xl:size-12"
        >
          <Image
            src={product.image}
            alt={product.name_en}
            fill
            sizes="56px"
            className="object-contain transition-transform duration-300 group-hover/image:scale-105"
          />

          <span className="bg-background/75 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
            <Eye
              size={18}
              strokeWidth={1.8}
              className="text-foreground 3xl:size-[18px] xl:size-[15px] 2xl:size-4"
            />
          </span>
        </button>

        {/* Brand */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-sm truncate text-sm font-medium xl:text-[12px] 2xl:text-[13px]">
            {product.brand.name_en}
          </p>
        </div>

        {/* Description EN */}
        <div className="min-w-0">
          <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-sm leading-6 xl:text-[12px] xl:leading-5 2xl:text-[13px]">
            {product.description_en}
          </p>
        </div>

        {/* Description FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-sm leading-6 xl:text-[12px] xl:leading-5 2xl:text-[13px]"
          >
            {product.description_fa}
          </p>
        </div>

        {/* Actions */}
        <div className="3xl:gap-2 flex items-center justify-end gap-2 xl:gap-1.5">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleReduceIndex}
              aria-label={t("actions.moveUp")}
              className="border-border-secondary text-muted-foreground hover:border-custom-primary/40 hover:text-custom-primary 3xl:size-9 flex size-9 cursor-pointer items-center justify-center border transition-colors xl:size-8 2xl:size-[34px]"
            >
              <ChevronUp
                size={17}
                strokeWidth={1.8}
                className="3xl:size-[17px] xl:size-[15px]"
              />
            </button>

            <button
              type="button"
              onClick={handleIncreaseIndex}
              aria-label={t("actions.moveDown")}
              className="border-border-secondary text-muted-foreground hover:border-custom-primary/40 hover:text-custom-primary 3xl:size-9 flex size-9 cursor-pointer items-center justify-center border border-s-0 transition-colors xl:size-8 2xl:size-[34px]"
            >
              <ChevronDown
                size={17}
                strokeWidth={1.8}
                className="3xl:size-[17px] xl:size-[15px]"
              />
            </button>
          </div>

          {/* Edit */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={() =>
              router.push(`/${locale}/products/${product.id}/edit`)
            }
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2.5 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
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
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2.5 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
}
