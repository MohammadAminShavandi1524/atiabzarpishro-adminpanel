"use client";

import { useState } from "react";

import { z } from "zod";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { LoaderCircle, PackageSearch } from "lucide-react";

import { FormField } from "@/components/FormField";
import { useCustomToast } from "@/components/ui/custom-toast";

import BrandSelect from "@/components/addProduct/BrandSelect";
import ProductImageUploadField from "@/components/addProduct/ProductImageUploadField";
import ProductBrochureUploadField from "@/components/addProduct/ProductBrochureUploadField";

const EditProductForm = () => {
  const t = useTranslations("editProduct");
  const toast = useCustomToast();

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [brochureUploadProgress, setBrochureUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [isBrochureFinalizing, setIsBrochureFinalizing] = useState(false);

  const schema = z.object({
    name_en: z.string().trim().min(1, t("validation.nameEnRequired")),

    name_fa: z.string().trim().min(1, t("validation.nameFaRequired")),

    brand_id: z.number().int().positive(t("validation.brandRequired")),

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

    brochure: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type === "application/pdf"),
        {
          message: t("validation.brochureInvalid"),
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
     * فعلاً داده تستی
     *
     * بعداً GET single product می‌زنیم
     * و با reset() فرم رو پر می‌کنیم.
     */
    defaultValues: {
      name_en: "product1",
      name_fa: "محصول 1",

      brand_id: 2,

      /*
       * فایل‌ها در Edit همیشه خالی می‌مونن.
       */
      image: undefined,
      brochure: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    /*
     * فعلاً فقط Payload رو آماده می‌کنیم.
     *
     * هنوز Update واقعی به Backend وصل نشده.
     */

    const payload: {
      name_en: string;
      name_fa: string;

      brand_id: number;

      image?: File;
      brochure?: File;
    } = {
      name_en: data.name_en,
      name_fa: data.name_fa,

      brand_id: data.brand_id,
    };

    /*
     * فایل جدید فقط در صورت انتخاب
     * وارد Payload می‌شود.
     */
    if (data.image) {
      payload.image = data.image;
    }

    if (data.brochure) {
      payload.brochure = data.brochure;
    }

    console.log("EDIT PRODUCT PAYLOAD =>", payload);

    toast.success(t("toast.previewSuccess"));
  };

  const isFinalizing = isImageFinalizing || isBrochureFinalizing;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[650px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <PackageSearch
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
          lang="en"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / PRODUCT MANAGEMENT
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

          {/* Brand */}
          <Controller
            control={control}
            name="brand_id"
            render={({ field }) => (
              <BrandSelect field={field} error={errors.brand_id} />
            )}
          />

          {/* Optional Files */}
          <div className="grid grid-cols-2 gap-6">
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

            <Controller
              control={control}
              name="brochure"
              render={({ field }) => (
                <ProductBrochureUploadField
                  value={field.value}
                  onChange={(file) => {
                    field.onChange(file);

                    setBrochureUploadProgress(0);

                    setIsBrochureFinalizing(false);
                  }}
                  error={errors.brochure?.message as string | undefined}
                  progress={brochureUploadProgress}
                  isUploading={isSubmitting}
                  isFinalizing={isBrochureFinalizing}
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

export default EditProductForm;
