"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Controller, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ExternalLink,
  FilePenLine,
  FileUp,
  Link2,
  LoaderCircle,
} from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import TechNewsImageUploadField from "@/components/addTechNews/TechNewsImageUploadField";

import TechNewsPdfUploadField from "@/components/addTechNews/TechNewsPdfUploadField";

import { uploadTechNewsFile } from "@/components/addTechNews/forms/technews-upload";

import { getTechNews, type TechNewsDetails } from "../get-technews.api";

import {
  updateTechNews,
  type UpdateTechNewsPayload,
} from "../update-technews.api";

import {
  editTechNewsSchema,
  type EditTechNewsFormValues,
} from "./edit-technews.schema";

interface EditTechNewsFormProps {
  newsId: string;
}

export default function EditTechNewsForm({ newsId }: EditTechNewsFormProps) {
  const t = useTranslations("editTechNews");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const [currentTechNews, setCurrentTechNews] =
    useState<TechNewsDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [isPdfFinalizing, setIsPdfFinalizing] = useState(false);

  const schema = useMemo(
    () => editTechNewsSchema(t, currentTechNews?.object_storage ?? true),
    [t, currentTechNews?.object_storage],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,

    formState: { errors, isSubmitting },
  } = useForm<EditTechNewsFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
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

  /*
   * GET current Tech News
   */
  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        setLoading(true);

        const data = await getTechNews(newsId);

        setCurrentTechNews(data);

        reset({
          name_en: data.name_en,

          name_fa: data.name_fa,

          image: undefined,

          source: data.object_storage ? "upload" : "url",

          pdf: undefined,

          external_url: data.object_storage ? "" : data.url,
        });
      } catch (error) {
        console.error("GET TECH NEWS ERROR =>", error);

        toast.error(t("toast.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchTechNews();
  }, [newsId, reset, t, toast]);

  /*
   * Source → Upload
   */
  const selectUploadSource = () => {
    setValue("source", "upload");

    setValue("external_url", "");

    clearErrors("external_url");
  };

  /*
   * Source → External URL
   */
  const selectUrlSource = () => {
    setValue("source", "url");

    setValue("pdf", undefined);

    /*
     * اگر Source اصلی External URL بوده،
     * URL فعلی را برگردان.
     */
    if (currentTechNews && !currentTechNews.object_storage) {
      setValue("external_url", currentTechNews.url);
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
  const onSubmit = async (data: EditTechNewsFormValues) => {
    if (!currentTechNews) {
      return;
    }

    try {
      resetUploadStates();

      /*
       * IMAGE
       *
       * null یعنی تصویر جدیدی انتخاب نشده.
       * Backend تصویر فعلی را نگه می‌دارد.
       */
      let finalImage: string | null = null;

      if (data.image instanceof File) {
        finalImage = await uploadTechNewsFile({
          file: data.image,

          url: "/api/technews/upload-image",

          onProgress: setImageUploadProgress,

          onFinalizing: setIsImageFinalizing,
        });
      }

      /*
       * SOURCE
       */
      let finalUrl: string | null = currentTechNews.url;

      let objectStorage = currentTechNews.object_storage;

      /*
       * Upload PDF
       */
      if (data.source === "upload") {
        objectStorage = true;

        /*
         * اگر PDF جدید انتخاب شده، آپلود شود.
         */
        if (data.pdf instanceof File) {
          finalUrl = await uploadTechNewsFile({
            file: data.pdf,

            url: "/api/technews/upload-pdf",

            onProgress: setPdfUploadProgress,

            onFinalizing: setIsPdfFinalizing,
          });
        } else if (!currentTechNews.object_storage) {
          /*
           * این حالت توسط Zod نباید اجازه Submit بگیرد،
           * ولی برای اطمینان اینجا هم نگه می‌داریم.
           */
          throw new Error("PDF is required when switching to upload source.");
        }
      }

      /*
       * External URL
       */
      if (data.source === "url") {
        objectStorage = false;

        finalUrl = data.external_url?.trim() ?? "";
      }

      const payload: UpdateTechNewsPayload = {
        name_en: data.name_en,

        name_fa: data.name_fa,

        image: finalImage,

        object_storage: objectStorage,

        url: finalUrl,
      };

      await updateTechNews(newsId, payload);

      toast.success(t("toast.updateSuccess"));

      router.push(`/${locale}/technews`);
    } catch (error) {
      console.error("UPDATE TECH NEWS ERROR =>", error);

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

  if (!currentTechNews) {
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
            <FilePenLine
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
            {currentTechNews.object_storage
              ? t("current.uploaded")
              : t("current.external")}
          </p>

          <button
            type="button"
            onClick={() =>
              window.open(currentTechNews.url, "_blank", "noopener,noreferrer")
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
          <div className="flex flex-col gap-y-7 pb-6">
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

            {/* Current Image */}
            <div>
              <label className="text-foreground mb-3 block text-sm font-medium">
                {t("form.currentImage")}
              </label>

              <div className="border-border-secondary bg-background flex items-center gap-5 border p-4">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden">
                  <Image
                    src={currentTechNews.image}
                    alt={currentTechNews.name_en}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <p className="text-muted-foreground max-w-[500px] text-sm leading-7">
                  {t("form.imageHint")}
                </p>
              </div>
            </div>

            {/* New Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <TechNewsImageUploadField
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
                {currentTechNews.object_storage && (
                  <div className="border-border-secondary bg-background border px-5 py-4">
                    <p className="text-muted-foreground text-sm leading-7">
                      {t("form.pdfHint")}
                    </p>
                  </div>
                )}

                <Controller
                  control={control}
                  name="pdf"
                  render={({ field }) => (
                    <TechNewsPdfUploadField
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
}
