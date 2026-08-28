"use client";

import { useState } from "react";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm, useWatch } from "react-hook-form";

import { BookPlus, FileUp, Link2, LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import BrandImageUploadField from "@/components/addBrand/BrandImageUploadField";
import BrandCatalogUploadField from "@/components/addBrand/BrandCatalogUploadField";

import BrandSelect from "../BrandSelect";

import type {
  CreateCataloguePayload,
  UploadResponse,
} from "../catalogue.types";

const CatalogueForm = () => {
  const t = useTranslations("addCatalogue");

  const locale = useLocale();

  const toast = useCustomToast();

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [isPdfFinalizing, setIsPdfFinalizing] = useState(false);

  const schema = z
    .object({
      brand_id: z.number().min(1, t("validation.brandRequired")),

      name_en: z.string().trim().min(1, t("validation.nameEnRequired")),

      name_fa: z.string().trim().min(1, t("validation.nameFaRequired")),

      description_en: z
        .string()
        .trim()
        .min(1, t("validation.descriptionEnRequired")),

      description_fa: z
        .string()
        .trim()
        .min(1, t("validation.descriptionFaRequired")),

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

      source: z.enum(["upload", "url"]),

      pdf: z.any().optional(),

      external_url: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === "upload") {
        if (!(data.pdf instanceof File)) {
          ctx.addIssue({
            code: "custom",
            path: ["pdf"],
            message: t("validation.pdfRequired"),
          });

          return;
        }

        if (data.pdf.type !== "application/pdf") {
          ctx.addIssue({
            code: "custom",
            path: ["pdf"],
            message: t("validation.pdfInvalid"),
          });
        }
      }

      if (data.source === "url") {
        const url = data.external_url?.trim() ?? "";

        if (!url) {
          ctx.addIssue({
            code: "custom",
            path: ["external_url"],
            message: t("validation.urlRequired"),
          });

          return;
        }

        try {
          const parsedUrl = new URL(url);

          if (
            parsedUrl.protocol !== "http:" &&
            parsedUrl.protocol !== "https:"
          ) {
            throw new Error();
          }
        } catch {
          ctx.addIssue({
            code: "custom",
            path: ["external_url"],
            message: t("validation.urlInvalid"),
          });
        }
      }
    });

  type FormValues = z.infer<typeof schema>;

  const {
    register,

    control,

    handleSubmit,

    reset,

    setValue,

    clearErrors,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      brand_id: 0,

      name_en: "",
      name_fa: "",

      description_en: "",
      description_fa: "",

      image: undefined,

      source: "upload",

      pdf: undefined,

      external_url: "",
    },
  });

  const source = useWatch({
    control,
    name: "source",
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

  const selectUploadSource = () => {
    setValue("source", "upload");

    setValue("external_url", "");

    clearErrors("external_url");
  };

  const selectUrlSource = () => {
    setValue("source", "url");

    setValue("pdf", undefined);

    setPdfUploadProgress(0);

    setIsPdfFinalizing(false);

    clearErrors("pdf");
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setImageUploadProgress(0);

      setPdfUploadProgress(0);

      setIsImageFinalizing(false);

      setIsPdfFinalizing(false);

      /*
       * Cover Upload
       */
      const imageUrl = await uploadFile({
        file: data.image,

        url: "/api/catalogue/upload-image",

        onProgress: setImageUploadProgress,

        onFinalizing: setIsImageFinalizing,
      });

      /*
       * Catalogue Source
       */
      let catalogueUrl = "";

      let objectStorage = false;

      if (data.source === "upload") {
        catalogueUrl = await uploadFile({
          file: data.pdf as File,

          url: "/api/catalogue/upload-pdf",

          onProgress: setPdfUploadProgress,

          onFinalizing: setIsPdfFinalizing,
        });

        objectStorage = true;
      }

      if (data.source === "url") {
        catalogueUrl = data.external_url?.trim() ?? "";

        objectStorage = false;
      }

      /*
       * Payload
       */
      const payload: CreateCataloguePayload = {
        brand_id: data.brand_id,

        name_en: data.name_en,

        name_fa: data.name_fa,

        description_en: data.description_en,

        description_fa: data.description_fa,

        image: imageUrl,

        object_storage: objectStorage,

        url: catalogueUrl,
      };

      const response = await fetch("/api/catalogue/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Create catalogue failed";

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
        brand_id: 0,

        name_en: "",
        name_fa: "",

        description_en: "",
        description_fa: "",

        image: undefined,

        source: "upload",

        pdf: undefined,

        external_url: "",
      });

      setImageUploadProgress(0);

      setPdfUploadProgress(0);

      setIsImageFinalizing(false);

      setIsPdfFinalizing(false);
    } catch (error) {
      setImageUploadProgress(0);

      setPdfUploadProgress(0);

      setIsImageFinalizing(false);

      setIsPdfFinalizing(false);

      console.error("CREATE CATALOGUE ERROR =>", error);

      toast.error(t("toast.error"));
    }
  };

  const isFinalizing = isImageFinalizing || isPdfFinalizing;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[700px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <BookPlus
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5">
            <h2 className="text-foreground text-xl font-semibold">
              {t("formHeader.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("formHeader.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="relative min-h-0 p-8 pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="h-[580px] w-full pe-5"
          scrollBarClassName="me-0"
        >
          <div className="flex flex-col gap-y-7 pb-28">
            {/* Brand */}
            <Controller
              control={control}
              name="brand_id"
              render={({ field }) => (
                <BrandSelect field={field} error={errors.brand_id} />
              )}
            />

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

            {/* Cover */}
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

            {/* Source */}
            <div>
              <label className="text-foreground mb-3 block text-sm font-medium">
                {t("form.source.label")}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={selectUploadSource}
                  className={
                    source === "upload"
                      ? "border-custom-primary bg-custom-primary/[0.05] text-custom-primary flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium"
                      : "border-border-secondary text-foreground hover:border-custom-primary/40 flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium transition-colors"
                  }
                >
                  <FileUp size={17} strokeWidth={1.7} />

                  {t("form.source.upload")}
                </button>

                <button
                  type="button"
                  onClick={selectUrlSource}
                  className={
                    source === "url"
                      ? "border-custom-primary bg-custom-primary/[0.05] text-custom-primary flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium"
                      : "border-border-secondary text-foreground hover:border-custom-primary/40 flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium transition-colors"
                  }
                >
                  <Link2 size={17} strokeWidth={1.7} />

                  {t("form.source.url")}
                </button>
              </div>
            </div>

            {/* PDF Upload */}
            {source === "upload" && (
              <Controller
                control={control}
                name="pdf"
                render={({ field }) => (
                  <BrandCatalogUploadField
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);

                      setPdfUploadProgress(0);

                      setIsPdfFinalizing(false);
                    }}
                    error={errors.pdf?.message as string | undefined}
                    progress={pdfUploadProgress}
                    isUploading={isSubmitting}
                    isFinalizing={isPdfFinalizing}
                  />
                )}
              />
            )}

            {/* External URL */}
            {source === "url" && (
              <FormField
                label={t("form.externalUrl.label")}
                placeholder={t("form.externalUrl.placeholder")}
                register={register("external_url")}
                error={errors.external_url}
                as="input"
              />
            )}
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

export default CatalogueForm;
