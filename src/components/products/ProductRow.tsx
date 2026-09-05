"use client";

import Image from "next/image";

import { type Dispatch, type SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ChevronDown, ChevronUp, Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { Product } from "./products.api";

import { deleteProduct } from "./delete-product.api";

import { increaseProductIndex, reduceProductIndex } from "./product-index.api";

interface ProductRowProps {
  product: Product;

  setProducts: Dispatch<SetStateAction<Product[]>>;

  refreshProducts: () => Promise<void>;
}

export default function ProductRow({
  product,
  setProducts,
  refreshProducts,
}: ProductRowProps) {
  const locale = useLocale();

  const t = useTranslations("Products");

  const router = useRouter();

  const toast = useCustomToast();

  const formattedDate = formatDate(product.created, locale);

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
    <article className="group/product border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300">
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/product:scale-y-100" />

      <div className="grid min-h-[94px] grid-cols-[60px_1fr_1fr_100px_1fr_1.4fr_1.4fr_135px_260px] items-center gap-4 px-5 py-3">
        {/* ID */}
        <div className="text-muted-foreground text-sm">
          {locale === "fa"
            ? `${englishToPersianNumber(String(product.id))}#`
            : `#${product.id}`}
        </div>

        {/* Name EN */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-[15px] font-medium">
            {product.name_en}
          </p>
        </div>

        {/* Name FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground truncate text-[15px] font-medium"
          >
            {product.name_fa}
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
            src={product.image}
            alt={product.name_en}
            fill
            sizes="56px"
            className="object-contain transition-transform duration-300 group-hover/image:scale-105"
          />

          <span className="bg-background/75 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
            <Eye size={18} strokeWidth={1.8} className="text-foreground" />
          </span>
        </button>

        {/* Brand */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">
            {product.brand.name_en}
          </p>
        </div>

        {/* Description EN */}
        <div className="min-w-0">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
            {product.description_en}
          </p>
        </div>

        {/* Description FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-muted-foreground line-clamp-2 text-sm leading-6"
          >
            {product.description_fa}
          </p>
        </div>

        {/* Date */}
        <div className="text-muted-foreground text-sm">{formattedDate}</div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleReduceIndex}
              aria-label={t("actions.moveUp")}
              className="border-border-secondary text-muted-foreground hover:border-custom-primary/40 hover:text-custom-primary flex size-9 cursor-pointer items-center justify-center border transition-colors"
            >
              <ChevronUp size={17} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={handleIncreaseIndex}
              aria-label={t("actions.moveDown")}
              className="border-border-secondary text-muted-foreground hover:border-custom-primary/40 hover:text-custom-primary flex size-9 cursor-pointer items-center justify-center border border-s-0 transition-colors"
            >
              <ChevronDown size={17} strokeWidth={1.8} />
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
