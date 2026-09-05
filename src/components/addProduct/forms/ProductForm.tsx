"use client";

import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { LoaderCircle, PackagePlus } from "lucide-react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomToast } from "@/components/ui/custom-toast";

import BrandSelect from "../BrandSelect";
import ProductImageUploadField from "../ProductImageUploadField";

import {
  createProductSchema,
  type ProductFormValues,
} from "./product-form.schema";

import type { CreateProductPayload } from "./create-product.types";

interface UploadResponse {
  success: boolean;
  url: string;
}

export default function ProductForm() {
  const t = useTranslations("addProduct");

  const locale = useLocale();

  const toast = useCustomToast();

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const schema = createProductSchema(t);

  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name_en: "",
      name_fa: "",

      description_en: "",
      description_fa: "",

      brand_id: 0,

      image: undefined,
    },
  });

  const uploadFile = ({
    file,
    url,
    onProgress,
    onFinalizing,
  }: {
    file: File;

    url: string;

    onProgress: (value: number) => void;

    onFinalizing: (value: boolean) => void;
  }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", url);

      xhr.upload.onloadstart = () => {
        onProgress(0);

        onFinalizing(false);
      };

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return;
        }

        const rawProgress = Math.round((event.loaded / event.total) * 100);

        onProgress(Math.min(rawProgress, 95));
      };

      xhr.upload.onload = () => {
        onProgress(95);

        onFinalizing(true);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          onFinalizing(false);

          reject(new Error("Upload failed"));

          return;
        }

        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);

          if (!response.url) {
            throw new Error("URL not returned");
          }

          onProgress(100);

          onFinalizing(false);

          resolve(response.url);
        } catch {
          onFinalizing(false);

          reject(new Error("Invalid upload response"));
        }
      };

      xhr.onerror = () => {
        onFinalizing(false);

        reject(new Error("Upload failed"));
      };

      xhr.onabort = () => {
        onFinalizing(false);

        reject(new Error("Upload aborted"));
      };

      xhr.send(formData);
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      const imageUrl = await uploadFile({
        file: data.image,

        url: "/api/product/upload-image",

        onProgress: setImageUploadProgress,

        onFinalizing: setIsImageFinalizing,
      });

      const payload: CreateProductPayload = {
        name_en: data.name_en,

        name_fa: data.name_fa,

        description_en: data.description_en || null,

        description_fa: data.description_fa || null,

        brand_id: data.brand_id,

        image: imageUrl,
      };

      const response = await fetch("/api/product/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);

        console.error("CREATE PRODUCT RESPONSE ERROR =>", error);

        throw new Error(
          error?.error?.detail ??
            error?.error ??
            error?.detail ??
            "Create product failed",
        );
      }

      toast.success(t("toast.createSuccess"));

      reset({
        name_en: "",
        name_fa: "",

        description_en: "",
        description_fa: "",

        brand_id: 0,

        image: undefined,
      });

      setImageUploadProgress(0);

      setIsImageFinalizing(false);
    } catch (error) {
      console.error("CREATE PRODUCT ERROR =>", error);

      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      toast.error(t("toast.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[650px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <PackagePlus
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5">
            <h2 className="text-foreground mt-3 text-xl font-semibold">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("header.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / PRODUCT MANAGEMENT
        </div>
      </div>

      {/* Fields */}
      <div className="relative min-h-0 p-8 pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="h-[520px] w-full pe-5"
        >
          <div className="flex flex-col gap-y-7">
            {/* Names */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label={t("form.nameEn.label")}
                placeholder={t("form.nameEn.placeholder")}
                register={register("name_en")}
                error={errors.name_en}
                as="input"
              />

              <FormField
                label={t("form.nameFa.label")}
                placeholder={t("form.nameFa.placeholder")}
                register={register("name_fa")}
                error={errors.name_fa}
                as="input"
              />
            </div>

            {/* Brand */}
            <Controller
              control={control}
              name="brand_id"
              render={({ field }) => (
                <BrandSelect field={field} error={errors.brand_id} />
              )}
            />

            {/* Descriptions */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label={t("form.descriptionEn.label")}
                placeholder={t("form.descriptionEn.placeholder")}
                register={register("description_en")}
                error={errors.description_en}
                as="textarea"
              />

              <FormField
                label={t("form.descriptionFa.label")}
                placeholder={t("form.descriptionFa.placeholder")}
                register={register("description_fa")}
                error={errors.description_fa}
                as="textarea"
              />
            </div>

            {/* Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ProductImageUploadField
                  value={field.value}
                  onChange={(file) => {
                    field.onChange(file);

                    setImageUploadProgress(0);

                    setIsImageFinalizing(false);
                  }}
                  error={errors.image?.message as string | undefined}
                  progress={imageUploadProgress}
                  isUploading={isSubmitting}
                  isFinalizing={isImageFinalizing}
                />
              )}
            />
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="border-border-secondary bg-secondary-bg absolute inset-x-8 bottom-0 flex justify-end border-t py-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-custom-primary text-primary-foreground flex min-w-[190px] cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.8} />
            )}

            {isImageFinalizing
              ? t("form.finalizing")
              : isSubmitting
                ? t("form.submitting")
                : t("form.submit")}
          </button>
        </div>
      </div>
    </form>
  );
}
