"use client";

import { useState } from "react";

import { z } from "zod";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Badge, LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";
import { useCustomToast } from "@/components/ui/custom-toast";

import BrandImageUploadField from "@/components/addBrand/BrandImageUploadField";
import BrandCatalogUploadField from "@/components/addBrand/BrandCatalogUploadField";

const EditBrandForm = () => {
  const t = useTranslations("editBrand");
  const toast = useCustomToast();

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [catalogUploadProgress, setCatalogUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [isCatalogFinalizing, setIsCatalogFinalizing] = useState(false);

  const schema = z.object({
    name_en: z
      .string()
      .trim()
      .min(1, t("validation.nameEnRequired"))
      .max(300, t("validation.nameMax")),

    name_fa: z
      .string()
      .trim()
      .min(1, t("validation.nameFaRequired"))
      .max(300, t("validation.nameMax")),

    description_en: z
      .string()
      .trim()
      .min(1, t("validation.descriptionEnRequired")),

    description_fa: z
      .string()
      .trim()
      .min(1, t("validation.descriptionFaRequired")),

    image: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith("image/")),
        {
          message: t("validation.imageInvalid"),
        },
      ),

    catalog: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type === "application/pdf"),
        {
          message: t("validation.catalogInvalid"),
        },
      ),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    /*
     * فعلاً Fake Data
     *
     * بعداً این اطلاعات از GET Brand می‌آیند
     * و با reset(...) فرم را پر می‌کنیم.
     */
    defaultValues: {
      name_en: "KORLOY",
      name_fa: "کرولوی",

      description_en: "Brand description",

      description_fa: "توضیحات برند",

      /*
       * مهم:
       * Image و Catalog همیشه خالی هستند.
       */
      image: undefined,
      catalog: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    /*
     * فعلاً فقط UI و ساخت Payload
     * هیچ درخواست Update به Backend نمی‌زنیم.
     */

    const payload: {
      name_en: string;
      name_fa: string;

      description_en: string;
      description_fa: string;

      image?: File;
      catalog?: File;
    } = {
      name_en: data.name_en,
      name_fa: data.name_fa,

      description_en: data.description_en,

      description_fa: data.description_fa,
    };

    /*
     * فقط اگر فایل جدید انتخاب شده باشد
     * وارد payload می‌شود.
     */
    if (data.image) {
      payload.image = data.image;
    }

    if (data.catalog) {
      payload.catalog = data.catalog;
    }

    console.log("EDIT BRAND PAYLOAD =>", payload);

    toast.success(t("toast.previewSuccess"));
  };

  const isFinalizing = isImageFinalizing || isCatalogFinalizing;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[700px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <Badge className="text-custom-primary size-5" strokeWidth={1.6} />
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
          ATI / BRAND MANAGEMENT
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col justify-between p-8">
        <div className="space-y-7">
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

          {/* Optional Image + Catalog */}
          <div className="grid grid-cols-2 gap-6">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <BrandImageUploadField
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

            <Controller
              control={control}
              name="catalog"
              render={({ field }) => (
                <BrandCatalogUploadField
                  value={field.value}
                  onChange={(file) => {
                    field.onChange(file);

                    setCatalogUploadProgress(0);

                    setIsCatalogFinalizing(false);
                  }}
                  error={errors.catalog?.message as string | undefined}
                  progress={catalogUploadProgress}
                  isUploading={isSubmitting}
                  isFinalizing={isCatalogFinalizing}
                />
              )}
            />
          </div>

          {/* Help */}
          <div className="border-border-secondary bg-background border px-5 py-4">
            <p className="text-muted-foreground text-sm leading-6">
              {t("form.filesHint")}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="border-border-secondary mt-10 flex justify-end border-t pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-custom-primary text-primary-foreground flex min-w-[190px] cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.8} />
            )}

            {isFinalizing
              ? t("form.finalizing")
              : isSubmitting
                ? t("form.submitting")
                : t("form.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditBrandForm;
