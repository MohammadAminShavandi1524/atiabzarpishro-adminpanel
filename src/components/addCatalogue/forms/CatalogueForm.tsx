"use client";

import { useState } from "react";

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

const CatalogueForm = () => {
  const t = useTranslations("addCatalogue");

  const locale = useLocale();

  const toast = useCustomToast();

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

            {/* Cover Image */}
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

            {/* Catalogue Source */}
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
