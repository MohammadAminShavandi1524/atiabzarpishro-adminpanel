"use client";

import { useEffect, useState } from "react";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Badge, LoaderCircle } from "lucide-react";

import { useRouter } from "next/navigation";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import BrandImageUploadField from "@/components/addBrand/BrandImageUploadField";

import { getBrand } from "../get-brand.api";

import { updateBrand, type UpdateBrandPayload } from "../update-brand.api";

interface EditBrandFormProps {
  brandId: string;
}

interface UploadResponse {
  success: boolean;
  url: string;
}

const EditBrandForm = ({ brandId }: EditBrandFormProps) => {
  const t = useTranslations("editBrand");

  const router = useRouter();

  const locale = useLocale();

  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

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

    url: z
      .string()
      .trim()
      .min(1, t("validation.urlRequired"))
      .url(t("validation.urlInvalid")),

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
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name_en: "",
      name_fa: "",
      description_en: "",
      description_fa: "",
      url: "",
      image: undefined,
    },
  });

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);

        const brand = await getBrand(brandId);

        reset({
          name_en: brand.name_en,
          name_fa: brand.name_fa,
          description_en: brand.description_en,
          description_fa: brand.description_fa,
          url: brand.url ?? "",
          image: undefined,
        });
      } catch {
        toast.error(t("toast.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [brandId, reset, t, toast]);

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

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        onProgress(
          Math.min(Math.round((event.loaded / event.total) * 100), 95),
        );
      };

      xhr.upload.onload = () => {
        onProgress(95);

        onFinalizing(true);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error("Upload failed"));

          return;
        }

        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);

          onProgress(100);

          onFinalizing(false);

          resolve(response.url);
        } catch {
          reject(new Error("Invalid upload response"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      xhr.send(formData);
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      const imageUrl = data.image
        ? await uploadFile({
            file: data.image,
            url: "/api/brand/upload-image",
            onProgress: setImageUploadProgress,
            onFinalizing: setIsImageFinalizing,
          })
        : null;

      const payload: UpdateBrandPayload = {
        name_en: data.name_en,
        name_fa: data.name_fa,
        description_en: data.description_en,
        description_fa: data.description_fa,
        url: data.url,
        image: imageUrl,
      };

      await updateBrand(brandId, payload);

      toast.success(t("toast.updateSuccess"));

      router.push(`/${locale}/brands`);
    } catch {
      toast.error(t("toast.error"));
    }
  };

  if (loading) {
    return (
      <div className="border-border-secondary bg-secondary-bg flex min-h-0 flex-1 items-center justify-center border">
        <div className="flex items-center gap-3">
          <LoaderCircle
            className="text-custom-primary 3xl:size-5 size-5 animate-spin xl:size-[18px]"
            strokeWidth={1.8}
          />

          <span className="text-muted-foreground 3xl:text-sm text-sm xl:text-[13px]">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="border-border-secondary 3xl:p-7 flex min-h-0 flex-col justify-between border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <Badge
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:text-xl text-xl font-semibold xl:text-[18px] 2xl:text-[19px]">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="3xl:p-8 3xl:pe-3 flex min-h-0 flex-col p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 flex-1 pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-7 flex flex-col gap-y-7 pb-8 xl:gap-y-5 2xl:gap-y-6">
            {/* Names */}
            <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.nameEn.label")}
                placeholder={t("form.nameEn.placeholder")}
                register={register("name_en")}
                error={errors.name_en}
              />

              <FormField
                label={t("form.nameFa.label")}
                placeholder={t("form.nameFa.placeholder")}
                register={register("name_fa")}
                error={errors.name_fa}
              />
            </div>

            {/* Descriptions */}
            <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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

            {/* Website */}
            <FormField
              label={t("form.url.label")}
              placeholder={t("form.url.placeholder")}
              register={register("url")}
              error={errors.url}
            />

            {/* Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <BrandImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  progress={imageUploadProgress}
                  isUploading={isSubmitting}
                  isFinalizing={isImageFinalizing}
                />
              )}
            />

            {/* Hint */}
            <div className="border-border-secondary bg-background 3xl:px-5 3xl:py-4 border px-5 py-4 xl:px-4 xl:py-3 2xl:px-4.5 2xl:py-3.5">
              <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 text-sm leading-6 xl:text-[13px] xl:leading-5">
                {t("form.imageHint")}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-custom-primary text-primary-foreground 3xl:min-w-[190px] 3xl:px-6 3xl:py-3 3xl:text-sm flex min-w-[190px] cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-medium disabled:opacity-60 xl:min-w-[165px] xl:px-5 xl:py-2.5 xl:text-[13px] 2xl:min-w-[175px]"
          >
            {isSubmitting && (
              <LoaderCircle
                className="3xl:size-4 size-4 animate-spin xl:size-[15px]"
                strokeWidth={1.8}
              />
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
};

export default EditBrandForm;
