"use client";

import { useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm, useWatch } from "react-hook-form";

import { BookPlus, FileUp, Link2, LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import BrandImageUploadField from "@/components/addBrand/BrandImageUploadField";

import BrandSelect from "../BrandSelect";

import CataloguePdfUploadField from "../CataloguePdfUploadField";

import type { CreateCataloguePayload } from "../catalogue.types";

import {
  createCatalogueSchema,
  type CatalogueFormValues,
} from "./catalogue.schema";

import { uploadCatalogueFile } from "./catalogue-upload";
import { useCatalogueFormAnimation } from "./useCatalogueFormAnimation";



const CatalogueForm = () => {
  const t = useTranslations("addCatalogue");

  const locale = useLocale();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [isPdfFinalizing, setIsPdfFinalizing] = useState(false);

  const schema = createCatalogueSchema(t);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CatalogueFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      brand_id: 0,

      name_en: "",
      name_fa: "",

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

  useCatalogueFormAnimation({
    formRef,
    locale,
  });

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

  const resetUploadStates = () => {
    setImageUploadProgress(0);

    setPdfUploadProgress(0);

    setIsImageFinalizing(false);

    setIsPdfFinalizing(false);
  };

  const onSubmit = async (data: CatalogueFormValues) => {
    try {
      resetUploadStates();

      /*
       * Cover Image
       */
      const imageUrl = await uploadCatalogueFile({
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
        catalogueUrl = await uploadCatalogueFile({
          file: data.pdf as File,

          url: "/api/catalogue/upload-pdf",

          onProgress: setPdfUploadProgress,

          onFinalizing: setIsPdfFinalizing,
        });

        objectStorage = true;
      } else {
        catalogueUrl = data.external_url?.trim() ?? "";

        objectStorage = false;
      }

      /*
       * Create Catalogue
       */
      const payload: CreateCataloguePayload = {
        brand_id: data.brand_id,

        name_en: data.name_en,

        name_fa: data.name_fa,

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

        image: undefined,

        source: "upload",

        pdf: undefined,

        external_url: "",
      });

      resetUploadStates();
    } catch (error) {
      resetUploadStates();

      console.error("CREATE CATALOGUE ERROR =>", error);

      toast.error(t("toast.error"));
    }
  };

  const isFinalizing = isImageFinalizing || isPdfFinalizing;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="catalogue-form-info border-border-secondary 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <BookPlus
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="catalogue-form-heading 3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:text-xl text-xl font-semibold xl:text-[18px] 2xl:text-[19px]">
              {t("formHeader.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("formHeader.description")}
            </p>
          </div>
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
            <div className="catalogue-form-field">
              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <BrandSelect field={field} error={errors.brand_id} />
                )}
              />
            </div>

            {/* Names */}
            <div className="catalogue-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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

            {/* Cover Image */}
            <div className="catalogue-form-field">
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

            {/* Catalogue Source */}
            <div className="catalogue-form-field">
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

            {/* PDF Upload */}
            {source === "upload" && (
              <div className="catalogue-form-field">
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
            )}

            {/* External URL */}
            {source === "url" && (
              <div className="catalogue-form-field">
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
        <div className="catalogue-form-submit border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
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

export default CatalogueForm;
