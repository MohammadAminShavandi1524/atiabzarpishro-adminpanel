"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Controller, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  BookOpen,
  ExternalLink,
  FileUp,
  Link2,
  LoaderCircle,
} from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import BrandImageUploadField from "@/components/addBrand/BrandImageUploadField";

import BrandSelect from "@/components/addCatalogue/BrandSelect";

import CataloguePdfUploadField from "@/components/addCatalogue/CataloguePdfUploadField";

import { uploadCatalogueFile } from "@/components/addCatalogue/forms/catalogue-upload";

import { getCatalogue, type CatalogueDetails } from "../get-catalogue.api";

import {
  updateCatalogue,
  type UpdateCataloguePayload,
} from "../update-catalogue.api";

interface EditCatalogueFormProps {
  catalogueId: string;
}

type CatalogueSource = "upload" | "url";

const EditCatalogueForm = ({ catalogueId }: EditCatalogueFormProps) => {
  const t = useTranslations("editCatalogue");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  /*
   * Current catalogue
   */
  const [currentCatalogue, setCurrentCatalogue] =
    useState<CatalogueDetails | null>(null);

  const [loading, setLoading] = useState(true);

  /*
   * Upload State
   */
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [isPdfFinalizing, setIsPdfFinalizing] = useState(false);

  /*
   * Validation
   */
  const schema = z
    .object({
      brand_id: z.number().min(1, t("validation.brandRequired")),

      name_en: z.string().trim().min(1, t("validation.nameEnRequired")),

      name_fa: z.string().trim().min(1, t("validation.nameFaRequired")),

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

      source: z.enum(["upload", "url"]),

      pdf: z.custom<File | undefined>().optional(),

      external_url: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      /*
       * Upload Mode
       *
       * PDF is not always required on edit.
       * If the current catalogue already uses
       * object storage, the old PDF can remain.
       */
      if (data.source === "upload") {
        if (data.pdf && data.pdf.type !== "application/pdf") {
          ctx.addIssue({
            code: "custom",
            path: ["pdf"],
            message: t("validation.pdfInvalid"),
          });
        }

        /*
         * Previous source was URL and
         * user switches to Upload.
         *
         * A new PDF is required.
         */
        if (
          currentCatalogue &&
          !currentCatalogue.object_storage &&
          !(data.pdf instanceof File)
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["pdf"],
            message: t("validation.pdfRequiredOnSourceChange"),
          });
        }
      }

      /*
       * External URL Mode
       */
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

  /*
   * Form
   */
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

      image: undefined,

      source: "url",

      pdf: undefined,

      external_url: "",
    },
  });

  const source = useWatch({
    control,
    name: "source",
  });

  /*
   * Get current catalogue
   */
  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        setLoading(true);

        const catalogue = await getCatalogue(catalogueId);

        setCurrentCatalogue(catalogue);

        const initialSource: CatalogueSource = catalogue.object_storage
          ? "upload"
          : "url";

        reset({
          brand_id: catalogue.brand.id,

          name_en: catalogue.name_en,

          name_fa: catalogue.name_fa,

          image: undefined,

          source: initialSource,

          pdf: undefined,

          external_url: catalogue.object_storage ? "" : catalogue.url,
        });
      } catch (error) {
        console.error("GET CATALOGUE ERROR =>", error);

        toast.error(t("toast.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogue();
  }, [catalogueId, reset, t, toast]);

  /*
   * Select Upload
   */
  const selectUploadSource = () => {
    setValue("source", "upload");

    setValue("external_url", "");

    clearErrors("external_url");
  };

  /*
   * Select URL
   */
  const selectUrlSource = () => {
    setValue("source", "url");

    setValue("pdf", undefined);

    /*
     * If original source was URL,
     * restore current value.
     */
    if (currentCatalogue && !currentCatalogue.object_storage) {
      setValue("external_url", currentCatalogue.url);
    }

    setPdfUploadProgress(0);

    setIsPdfFinalizing(false);

    clearErrors("pdf");
  };

  const resetUploadStates = () => {
    setImageUploadProgress(0);

    setPdfUploadProgress(0);

    setIsImageFinalizing(false);

    setIsPdfFinalizing(false);
  };

  /*
   * Submit
   */
  const onSubmit = async (data: FormValues) => {
    if (!currentCatalogue) {
      return;
    }

    try {
      resetUploadStates();

      /*
       * Image
       *
       * null = backend keeps current image
       */
      let newImageUrl: string | null = null;

      if (data.image instanceof File) {
        newImageUrl = await uploadCatalogueFile({
          file: data.image,

          url: "/api/catalogue/upload-image",

          onProgress: setImageUploadProgress,

          onFinalizing: setIsImageFinalizing,
        });
      }

      /*
       * Catalogue URL
       */
      let finalUrl = currentCatalogue.url;

      let objectStorage = currentCatalogue.object_storage;

      /*
       * Upload mode
       */
      if (data.source === "upload") {
        objectStorage = true;

        /*
         * New PDF selected
         */
        if (data.pdf instanceof File) {
          finalUrl = await uploadCatalogueFile({
            file: data.pdf,

            url: "/api/catalogue/upload-pdf",

            onProgress: setPdfUploadProgress,

            onFinalizing: setIsPdfFinalizing,
          });
        }
      }

      /*
       * URL mode
       */
      if (data.source === "url") {
        objectStorage = false;

        finalUrl = data.external_url?.trim() ?? currentCatalogue.url;
      }

      /*
       * Payload
       */
      const payload: UpdateCataloguePayload = {
        brand_id: data.brand_id,

        name_en: data.name_en,

        name_fa: data.name_fa,

        image: newImageUrl,

        object_storage: objectStorage,

        url: finalUrl,
      };

      await updateCatalogue(catalogueId, payload);

      toast.success(t("toast.updateSuccess"));

      router.push(`/${locale}/catalogues`);
    } catch (error) {
      console.error("UPDATE CATALOGUE ERROR =>", error);

      resetUploadStates();

      toast.error(t("toast.error"));
    }
  };

  const isFinalizing = isImageFinalizing || isPdfFinalizing;

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="border-border-secondary bg-secondary-bg flex min-h-[700px] items-center justify-center border">
        <div className="flex items-center gap-3">
          <LoaderCircle
            className="text-custom-primary size-5 animate-spin"
            strokeWidth={1.8}
          />

          <span className="text-muted-foreground text-sm">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (!currentCatalogue) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[700px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <BookOpen
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

        {/* Current Source */}
        <div className="border-border-secondary border-t pt-6">
          <span className="text-muted-foreground text-xs">
            {t("current.source")}
          </span>

          <p className="text-foreground mt-2 text-sm font-medium">
            {currentCatalogue.object_storage
              ? t("current.uploaded")
              : t("current.external")}
          </p>

          <button
            type="button"
            onClick={() =>
              window.open(currentCatalogue.url, "_blank", "noopener,noreferrer")
            }
            className="text-custom-primary mt-3 flex cursor-pointer items-center gap-2 text-sm"
          >
            <ExternalLink size={15} strokeWidth={1.7} />

            {t("current.open")}
          </button>
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

            {/* Current Cover */}
            <div>
              <label className="text-foreground mb-3 block text-sm font-medium">
                {t("form.currentImage")}
              </label>

              <div className="border-border-secondary bg-background flex items-center gap-5 border p-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden">
                  <Image
                    src={currentCatalogue.image}
                    alt={currentCatalogue.name_en}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <p className="text-muted-foreground text-sm leading-6">
                  {t("form.imageHint")}
                </p>
              </div>
            </div>

            {/* Optional New Cover */}
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

            {/* PDF */}
            {source === "upload" && (
              <>
                {currentCatalogue.object_storage && (
                  <div className="border-border-secondary bg-background border px-5 py-4">
                    <p className="text-muted-foreground text-sm leading-6">
                      {t("form.pdfHint")}
                    </p>
                  </div>
                )}

                <Controller
                  control={control}
                  name="pdf"
                  render={({ field }) => (
                    <CataloguePdfUploadField
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
              </>
            )}

            {/* URL */}
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

export default EditCatalogueForm;
