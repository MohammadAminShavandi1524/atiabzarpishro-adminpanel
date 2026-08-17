"use client";

import { useState } from "react";

import { z } from "zod";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Clapperboard, LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";
import { useCustomToast } from "@/components/ui/custom-toast";
import VideoUploadField from "../addVideo/VideoUploadField";



const EditVideoForm = () => {
  const t = useTranslations("editVideo");
  const toast = useCustomToast();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCompleted, setUploadCompleted] = useState(false);
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
      .custom<File | undefined>()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith("video/")),
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

  const onSubmit = async (data: FormValues) => {
    // فعلاً فقط برای تست ظاهر فرم
    console.log("FORM DATA =>", data);

    toast.success(t("toast.updateSuccess"));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[620px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <Clapperboard
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
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / VIDEO MANAGEMENT
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

          {/* Video */}
          <Controller
            control={control}
            name="video"
            render={({ field }) => (
              <VideoUploadField
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);

                  setUploadProgress(0);
                  setUploadCompleted(false);
                  setIsFinalizing(false);

                  if (file) {
                    toast.success(t("toast.videoSelected"));
                  }
                }}
                error={errors.video?.message as string | undefined}
                progress={uploadProgress}
                isUploading={isSubmitting}
                isFinalizing={isFinalizing}
                uploadCompleted={uploadCompleted}
              />
            )}
          />
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

            {isSubmitting ? t("form.submitting") : t("form.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditVideoForm;
