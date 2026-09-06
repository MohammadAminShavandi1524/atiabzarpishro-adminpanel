"use client";

import { useRef, useState } from "react";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { BadgePlus, LoaderCircle } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomToast } from "@/components/ui/custom-toast";

import BrandImageUploadField from "../BrandImageUploadField";

gsap.registerPlugin(useGSAP);

interface UploadResponse {
  success: boolean;
  url: string;
}

const BrandForm = () => {
  const t = useTranslations("addBrand");
  const locale = useLocale();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

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
      .url(t("validation.urlInvalid"))
      .max(500, t("validation.urlMax")),

    image: z
      .custom<File>((value) => value instanceof File, {
        message: t("validation.imageRequired"),
      })
      .refine(
        (file) => file instanceof File && file.type.startsWith("image/"),
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

  useGSAP(
    () => {
      if (!formRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
      );

      timeline.fromTo(
        ".brand-form-info",
        {
          opacity: 0,
          x: locale === "fa" ? 18 : -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
        },
        "-=0.35",
      );

      timeline.fromTo(
        ".brand-form-heading",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.25",
      );

      timeline.fromTo(
        ".brand-form-field",
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".brand-form-submit",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.15",
      );
    },
    {
      scope: formRef,
      dependencies: [locale],
    },
  );

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

  const onSubmit = async (data: FormValues) => {
    try {
      setImageUploadProgress(0);
      setIsImageFinalizing(false);

      const imageUrl = await uploadFile({
        file: data.image,
        url: "/api/brand/upload-image",
        onProgress: setImageUploadProgress,
        onFinalizing: setIsImageFinalizing,
      });

      const payload = {
        name_en: data.name_en,
        name_fa: data.name_fa,
        description_en: data.description_en,
        description_fa: data.description_fa,
        image: imageUrl,
        url: data.url,
      };

      const response = await fetch("/api/brand/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Create brand failed";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData?.error?.detail ??
            errorData?.error ??
            errorData?.detail ??
            errorData?.message ??
            errorMessage;
        } catch {
          // Response may not be JSON.
        }

        throw new Error(errorMessage);
      }

      toast.success(t("toast.createSuccess"));

      reset({
        name_en: "",
        name_fa: "",
        description_en: "",
        description_fa: "",
        url: "",
        image: undefined,
      });

      setImageUploadProgress(0);
      setIsImageFinalizing(false);
    } catch (error) {
      setImageUploadProgress(0);
      setIsImageFinalizing(false);

      console.error("CREATE BRAND ERROR =>", error);

      toast.error(t("toast.error"));
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="brand-form-info border-border-secondary 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <BadgePlus
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="brand-form-heading 3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:mt-3 3xl:text-xl mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px]">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 3xl:text-[10px] 3xl:tracking-[0.12em] text-[10px] tracking-[0.12em] xl:text-[9px] xl:tracking-[0.1em]"
        >
          ATI / BRAND MANAGEMENT
        </div>
      </div>

      {/* Fields */}
      <div className="3xl:p-8 3xl:pe-3 flex min-h-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 flex-1 overflow-hidden pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-7 flex flex-col gap-y-7 pb-8 xl:gap-y-5 2xl:gap-y-6">
            {/* Names */}
            <div className="brand-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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
            <div className="brand-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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

            {/* Website URL */}
            <div className="brand-form-field">
              <FormField
                label={t("form.url.label")}
                placeholder={t("form.url.placeholder")}
                register={register("url")}
                error={errors.url}
                as="input"
              />
            </div>

            {/* Image */}
            <div className="brand-form-field">
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
            </div>
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="brand-form-submit border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-custom-primary text-primary-foreground 3xl:min-w-[190px] 3xl:px-6 3xl:py-3 3xl:text-sm flex min-w-[190px] cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60 xl:min-w-[165px] xl:px-5 xl:py-2.5 xl:text-[13px] 2xl:min-w-[175px]"
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

export default BrandForm;
