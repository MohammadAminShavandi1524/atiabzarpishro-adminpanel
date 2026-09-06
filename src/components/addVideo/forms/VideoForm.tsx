"use client";

import { useRef, useState } from "react";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Clapperboard, LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import VideoUploadField from "../VideoUploadField";

import { createVideo } from "../create-video.api";

import { useVideoFormAnimation } from "./useVideoFormAnimation";

interface UploadResponse {
  success: boolean;
  url: string;
}

const VideoForm = () => {
  const t = useTranslations("addVideo");

  const locale = useLocale();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [isFinalizing, setIsFinalizing] = useState(false);

  const schema = z.object({
    name_en: z
      .string()
      .trim()
      .min(1, t("validation.nameEnRequired"))
      .max(250, t("validation.nameMax")),

    name_fa: z
      .string()
      .trim()
      .min(1, t("validation.nameFaRequired"))
      .max(250, t("validation.nameMax")),

    description_en: z
      .string()
      .trim()
      .min(1, t("validation.descriptionEnRequired")),

    description_fa: z
      .string()
      .trim()
      .min(1, t("validation.descriptionFaRequired")),

    video: z
      .custom<File>((value) => value instanceof File, {
        message: t("validation.videoRequired"),
      })
      .refine(
        (file) => file instanceof File && file.type.startsWith("video/"),
        {
          message: t("validation.videoInvalid"),
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

      video: undefined,
    },
  });

  useVideoFormAnimation({
    formRef,
    locale,
  });

  const uploadVideoToArvan = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", "/api/video/upload");

      xhr.upload.onloadstart = () => {
        setUploadProgress(0);

        setIsFinalizing(false);
      };

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return;
        }

        const rawProgress = Math.round((event.loaded / event.total) * 100);

        setUploadProgress(Math.min(rawProgress, 95));
      };

      xhr.upload.onload = () => {
        setUploadProgress(95);

        setIsFinalizing(true);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          setIsFinalizing(false);

          reject(new Error("Video upload failed"));

          return;
        }

        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);

          if (!response.url) {
            throw new Error("Video URL not returned");
          }

          setUploadProgress(100);

          setIsFinalizing(false);

          resolve(response.url);
        } catch {
          setIsFinalizing(false);

          reject(new Error("Invalid upload response"));
        }
      };

      xhr.onerror = () => {
        setIsFinalizing(false);

        reject(new Error("Video upload failed"));
      };

      xhr.onabort = () => {
        setIsFinalizing(false);

        reject(new Error("Video upload aborted"));
      };

      xhr.send(formData);
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setUploadProgress(0);

      setIsFinalizing(false);

      const videoUrl = await uploadVideoToArvan(data.video);

      const payload = {
        name_en: data.name_en,

        name_fa: data.name_fa,

        description_en: data.description_en,

        description_fa: data.description_fa,

        video: videoUrl,
      };

      await createVideo(payload);

      toast.success(t("toast.uploadSuccess"));

      reset({
        name_en: "",
        name_fa: "",

        description_en: "",
        description_fa: "",

        video: undefined,
      });

      setUploadProgress(0);

      setIsFinalizing(false);
    } catch (error) {
      console.error("CREATE VIDEO ERROR =>", error);

      setUploadProgress(0);

      setIsFinalizing(false);

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
      <div className="video-form-info border-border-secondary 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <Clapperboard
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="video-form-heading 3xl:mt-5 mt-5 xl:mt-4">
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
          ATI / VIDEO MANAGEMENT
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
            {/* Names */}
            <div className="video-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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
            <div className="video-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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

            {/* Video */}
            <div className="video-form-field">
              <Controller
                control={control}
                name="video"
                render={({ field }) => (
                  <VideoUploadField
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);

                      setUploadProgress(0);

                      setIsFinalizing(false);

                      if (file) {
                        toast.success(t("toast.videoSelected"));
                      }
                    }}
                    error={errors.video?.message as string | undefined}
                    progress={uploadProgress}
                    isUploading={isSubmitting}
                    isFinalizing={isFinalizing}
                    uploadCompleted={false}
                  />
                )}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="video-form-submit border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
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
                ? `${t("form.submitting")} ${uploadProgress}%`
                : t("form.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideoForm;
