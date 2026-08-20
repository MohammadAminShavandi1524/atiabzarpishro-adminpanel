"use client";

import { useState } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Clapperboard,
  LoaderCircle,
} from "lucide-react";

import { FormField } from "@/components/FormField";
import { useCustomToast } from "@/components/ui/custom-toast";

import VideoUploadField from "../VideoUploadField";

interface UploadResponse {
  success: boolean;
  url: string;
}

const VideoForm = () => {
  const t = useTranslations("addVideo");
  const toast = useCustomToast();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const schema = z.object({
    name_en: z
      .string()
      .trim()
      .min(
        1,
        t("validation.nameEnRequired"),
      )
      .max(
        250,
        t("validation.nameMax"),
      ),

    name_fa: z
      .string()
      .trim()
      .min(
        1,
        t("validation.nameFaRequired"),
      )
      .max(
        250,
        t("validation.nameMax"),
      ),

    description_en: z
      .string()
      .trim()
      .min(
        1,
        t(
          "validation.descriptionEnRequired",
        ),
      ),

    description_fa: z
      .string()
      .trim()
      .min(
        1,
        t(
          "validation.descriptionFaRequired",
        ),
      ),

    video: z
      .custom<File>(
        (value) =>
          value instanceof File,
        {
          message: t(
            "validation.videoRequired",
          ),
        },
      )
      .refine(
        (file) =>
          file instanceof File &&
          file.type.startsWith(
            "video/",
          ),
        {
          message: t(
            "validation.videoInvalid",
          ),
        },
      ),
  });

  type FormValues =
    z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name_en: "video title",
      name_fa: "تیتر ویدیو",
      description_en:
        "video description",
      description_fa:
        "توضیح ویدیو",
      video: undefined,
    },
  });

  const uploadVideoToArvan = (
    file: File,
  ): Promise<string> => {
    return new Promise(
      (resolve, reject) => {
        const formData =
          new FormData();

        formData.append(
          "file",
          file,
        );

        const xhr =
          new XMLHttpRequest();

        xhr.open(
          "POST",
          "/api/video/upload",
        );

        xhr.upload.onloadstart =
          () => {
            setUploadProgress(0);
            setIsFinalizing(false);
          };

        xhr.upload.onprogress = (
          event,
        ) => {
          if (
            !event.lengthComputable
          ) {
            return;
          }

          const rawProgress =
            Math.round(
              (event.loaded /
                event.total) *
                100,
            );

          setUploadProgress(
            Math.min(
              rawProgress,
              95,
            ),
          );
        };

        xhr.upload.onload =
          () => {
            setUploadProgress(95);
            setIsFinalizing(true);
          };

        xhr.onload = () => {
          if (
            xhr.status < 200 ||
            xhr.status >= 300
          ) {
            setIsFinalizing(false);

            reject(
              new Error(
                "Video upload failed",
              ),
            );

            return;
          }

          try {
            const response: UploadResponse =
              JSON.parse(
                xhr.responseText,
              );

            if (!response.url) {
              throw new Error(
                "Video URL not returned",
              );
            }

            setUploadProgress(100);
            setIsFinalizing(false);

            resolve(response.url);
          } catch {
            setIsFinalizing(false);

            reject(
              new Error(
                "Invalid upload response",
              ),
            );
          }
        };

        xhr.onerror = () => {
          setIsFinalizing(false);

          reject(
            new Error(
              "Video upload failed",
            ),
          );
        };

        xhr.onabort = () => {
          setIsFinalizing(false);

          reject(
            new Error(
              "Video upload aborted",
            ),
          );
        };

        xhr.send(formData);
      },
    );
  };

  const onSubmit = async (
    data: FormValues,
  ) => {
    try {
      setUploadProgress(0);
      setIsFinalizing(false);

      const videoUrl =
        await uploadVideoToArvan(
          data.video,
        );

      const payload = {
        name_en: data.name_en,
        name_fa: data.name_fa,

        description_en:
          data.description_en,

        description_fa:
          data.description_fa,

        video: videoUrl,
      };

      console.log(
        "PAYLOAD =>",
        payload,
      );

      toast.success(
        t("toast.uploadSuccess"),
      );

      setUploadProgress(0);
      setIsFinalizing(false);
    } catch {
      setUploadProgress(0);
      setIsFinalizing(false);

      toast.error(
        t("toast.error"),
      );
    }
  };

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
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
              {t(
                "header.description",
              )}
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
              label={t(
                "form.nameEn.label",
              )}
              placeholder={t(
                "form.nameEn.placeholder",
              )}
              register={register(
                "name_en",
              )}
              error={
                errors.name_en
              }
              as="input"
            />

            <FormField
              label={t(
                "form.nameFa.label",
              )}
              placeholder={t(
                "form.nameFa.placeholder",
              )}
              register={register(
                "name_fa",
              )}
              error={
                errors.name_fa
              }
              as="input"
            />
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-6">
            <FormField
              label={t(
                "form.descriptionEn.label",
              )}
              placeholder={t(
                "form.descriptionEn.placeholder",
              )}
              register={register(
                "description_en",
              )}
              error={
                errors.description_en
              }
              as="textarea"
            />

            <FormField
              label={t(
                "form.descriptionFa.label",
              )}
              placeholder={t(
                "form.descriptionFa.placeholder",
              )}
              register={register(
                "description_fa",
              )}
              error={
                errors.description_fa
              }
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
                  field.onChange(
                    file,
                  );

                  setUploadProgress(
                    0,
                  );

                  setIsFinalizing(
                    false,
                  );

                  if (file) {
                    toast.success(
                      t(
                        "toast.videoSelected",
                      ),
                    );
                  }
                }}
                error={
                  errors.video
                    ?.message as
                    | string
                    | undefined
                }
                progress={
                  uploadProgress
                }
                isUploading={
                  isSubmitting
                }
                isFinalizing={
                  isFinalizing
                }
                uploadCompleted={
                  false
                }
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
              <LoaderCircle
                className="size-4 animate-spin"
                strokeWidth={1.8}
              />
            )}

            {isFinalizing
              ? t(
                  "form.finalizing",
                )
              : isSubmitting
                ? `${t(
                    "form.submitting",
                  )} ${uploadProgress}%`
                : t(
                    "form.submit",
                  )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideoForm;