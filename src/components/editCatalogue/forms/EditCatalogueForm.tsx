"use client";

import { useEffect, useRef, useState } from "react";

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

import { useEditCatalogueFormAnimation } from "./useEditCatalogueFormAnimation";

interface EditCatalogueFormProps {
  catalogueId: string;
}

type CatalogueSource = "upload" | "url";

const EditCatalogueForm = ({ catalogueId }: EditCatalogueFormProps) => {
  const t = useTranslations("editCatalogue");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

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

  useEditCatalogueFormAnimation({
    formRef,
    locale,
    enabled: !loading && !!currentCatalogue,
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
      <div className="border-border-secondary bg-secondary-bg flex min-h-0 flex-1 items-center justify-center border">
        <div className="3xl:gap-3 flex items-center gap-3 xl:gap-2.5">
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

  if (!currentCatalogue) {
    return null;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="edit-catalogue-form-info border-border-secondary 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <BookOpen
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="edit-catalogue-form-heading 3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:text-xl text-xl font-semibold xl:text-[18px] 2xl:text-[19px]">
              {t("formHeader.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("formHeader.description")}
            </p>
          </div>
        </div>

        {/* Current Source */}
        <div className="edit-catalogue-form-current border-border-secondary 3xl:pt-6 border-t pt-6 xl:pt-4 2xl:pt-5">
          <span className="text-muted-foreground 3xl:text-xs text-xs xl:text-[11px]">
            {t("current.source")}
          </span>

          <p className="text-foreground 3xl:mt-2 3xl:text-sm mt-2 text-sm font-medium xl:mt-1.5 xl:text-[13px]">
            {currentCatalogue.object_storage
              ? t("current.uploaded")
              : t("current.external")}
          </p>

          <button
            type="button"
            onClick={() =>
              window.open(currentCatalogue.url, "_blank", "noopener,noreferrer")
            }
            className="text-custom-primary 3xl:mt-3 3xl:gap-2 3xl:text-sm mt-3 flex cursor-pointer items-center gap-2 text-sm xl:mt-2.5 xl:gap-1.5 xl:text-[13px]"
          >
            <ExternalLink
              size={15}
              strokeWidth={1.7}
              className="3xl:size-[15px] xl:size-[14px]"
            />

            {t("current.open")}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="3xl:p-8 3xl:pe-3 flex min-h-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 flex-1 pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-7 flex flex-col gap-y-7 pb-8 xl:gap-y-5 2xl:gap-y-6">
            {/* Brand */}
            <div className="edit-catalogue-form-field relative z-10">
              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <BrandSelect field={field} error={errors.brand_id} />
                )}
              />
            </div>

            {/* Names */}
            <div className="edit-catalogue-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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
            <div className="edit-catalogue-form-field">
              <label className="text-foreground 3xl:mb-3 mb-3 block text-sm font-medium xl:mb-2.5 xl:text-[13px] 2xl:text-sm">
                {t("form.currentImage")}
              </label>

              <div className="border-border-secondary bg-background 3xl:gap-5 flex items-center gap-5 border p-4 xl:gap-4 xl:p-3.5 2xl:gap-4.5 2xl:p-4">
                <div className="3xl:h-24 3xl:w-20 relative h-24 w-20 shrink-0 overflow-hidden xl:h-20 xl:w-16 2xl:h-[88px] 2xl:w-[72px]">
                  <Image
                    src={currentCatalogue.image}
                    alt={currentCatalogue.name_en}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 text-sm leading-6 xl:text-[13px] xl:leading-5">
                  {t("form.imageHint")}
                </p>
              </div>
            </div>

            {/* Optional New Cover */}
            <div className="edit-catalogue-form-field">
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

            {/* Source */}
            <div className="edit-catalogue-form-field">
              <label className="text-foreground 3xl:mb-3 mb-3 block text-sm font-medium xl:mb-2.5 xl:text-[13px] 2xl:text-sm">
                {t("form.source.label")}
              </label>

              <div className="3xl:gap-3 grid grid-cols-2 gap-3 xl:gap-2.5">
                <button
                  type="button"
                  onClick={selectUploadSource}
                  className={
                    source === "upload"
                      ? "border-custom-primary bg-custom-primary/[0.05] text-custom-primary 3xl:h-12 3xl:gap-2 3xl:text-sm flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium xl:h-11 xl:gap-1.5 xl:text-[13px] 2xl:h-[46px]"
                      : "border-border-secondary text-foreground hover:border-custom-primary/40 3xl:h-12 3xl:gap-2 3xl:text-sm flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium transition-colors xl:h-11 xl:gap-1.5 xl:text-[13px] 2xl:h-[46px]"
                  }
                >
                  <FileUp
                    size={17}
                    strokeWidth={1.7}
                    className="3xl:size-[17px] xl:size-[15px]"
                  />

                  {t("form.source.upload")}
                </button>

                <button
                  type="button"
                  onClick={selectUrlSource}
                  className={
                    source === "url"
                      ? "border-custom-primary bg-custom-primary/[0.05] text-custom-primary 3xl:h-12 3xl:gap-2 3xl:text-sm flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium xl:h-11 xl:gap-1.5 xl:text-[13px] 2xl:h-[46px]"
                      : "border-border-secondary text-foreground hover:border-custom-primary/40 3xl:h-12 3xl:gap-2 3xl:text-sm flex h-12 cursor-pointer items-center justify-center gap-2 border text-sm font-medium transition-colors xl:h-11 xl:gap-1.5 xl:text-[13px] 2xl:h-[46px]"
                  }
                >
                  <Link2
                    size={17}
                    strokeWidth={1.7}
                    className="3xl:size-[17px] xl:size-[15px]"
                  />

                  {t("form.source.url")}
                </button>
              </div>
            </div>

            {/* PDF */}
            {source === "upload" && (
              <>
                {currentCatalogue.object_storage && (
                  <div className="edit-catalogue-form-field border-border-secondary bg-background 3xl:px-5 3xl:py-4 border px-5 py-4 xl:px-4 xl:py-3 2xl:px-4.5 2xl:py-3.5">
                    <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 text-sm leading-6 xl:text-[13px] xl:leading-5">
                      {t("form.pdfHint")}
                    </p>
                  </div>
                )}

                <div className="edit-catalogue-form-field">
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
                </div>
              </>
            )}

            {/* URL */}
            {source === "url" && (
              <div className="edit-catalogue-form-field">
                <FormField
                  label={t("form.externalUrl.label")}
                  placeholder={t("form.externalUrl.placeholder")}
                  register={register("external_url")}
                  error={errors.external_url}
                  as="input"
                />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="edit-catalogue-form-submit border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
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
