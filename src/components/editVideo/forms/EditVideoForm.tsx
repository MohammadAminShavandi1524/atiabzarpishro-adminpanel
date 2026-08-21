"use client";

import {
  useEffect,
  useState,
} from "react";

import { z } from "zod";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import { useRouter } from "next/navigation";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Clapperboard,
  LoaderCircle,
} from "lucide-react";

import { FormField } from "@/components/FormField";

import { useCustomToast } from "@/components/ui/custom-toast";

import VideoUploadField from "@/components/addVideo/VideoUploadField";

import { getVideo } from "../get-video.api";

import {
  updateVideo,
  type UpdateVideoPayload,
} from "../update-video.api";

interface EditVideoFormProps {
  videoId: string;
}

interface UploadResponse {
  success: boolean;
  url: string;
}

const EditVideoForm = ({
  videoId,
}: EditVideoFormProps) => {
  const t =
    useTranslations("editVideo");

  const locale = useLocale();

  const router = useRouter();

  const toast =
    useCustomToast();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0);

  const [
    isFinalizing,
    setIsFinalizing,
  ] = useState(false);

  const schema = z.object({
    name_en: z
      .string()
      .trim()
      .min(
        1,
        t(
          "validation.nameEnRequired",
        ),
      )
      .max(
        250,
        t(
          "validation.nameMax",
        ),
      ),

    name_fa: z
      .string()
      .trim()
      .min(
        1,
        t(
          "validation.nameFaRequired",
        ),
      )
      .max(
        250,
        t(
          "validation.nameMax",
        ),
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
      .custom<
        File | undefined
      >()
      .optional()
      .refine(
        (file) =>
          !file ||
          (file instanceof File &&
            file.type.startsWith(
              "video/",
            )),
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
    reset,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver:
      zodResolver(schema),

    defaultValues: {
      name_en: "",
      name_fa: "",

      description_en: "",
      description_fa: "",

      video: undefined,
    },
  });

  useEffect(() => {
    const fetchVideo =
      async () => {
        try {
          setLoading(true);

          const video =
            await getVideo(
              videoId,
            );

          reset({
            name_en:
              video.name_en,

            name_fa:
              video.name_fa,

            description_en:
              video.description_en,

            description_fa:
              video.description_fa,

            video: undefined,
          });
        } catch (error) {
          console.error(
            "GET VIDEO ERROR =>",
            error,
          );

          toast.error(
            t(
              "toast.fetchError",
            ),
          );
        } finally {
          setLoading(false);
        }
      };

    fetchVideo();
  }, [
    videoId,
    reset,
    t,
    toast,
  ]);

  const uploadVideo = (
    file: File,
  ): Promise<string> => {
    return new Promise(
      (
        resolve,
        reject,
      ) => {
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

            if (
              !response.url
            ) {
              throw new Error(
                "Video URL not returned",
              );
            }

            setUploadProgress(100);
            setIsFinalizing(false);

            resolve(
              response.url,
            );
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
        data.video
          ? await uploadVideo(
              data.video,
            )
          : null;

      const payload: UpdateVideoPayload =
        {
          name_en:
            data.name_en,

          name_fa:
            data.name_fa,

          description_en:
            data.description_en,

          description_fa:
            data.description_fa,

          video:
            videoUrl,
        };

    

      await updateVideo(
        videoId,
        payload,
      );

      toast.success(
        t(
          "toast.updateSuccess",
        ),
      );

      router.push(
        `/${locale}/video-clips`,
      );
    } catch (error) {
      console.error(
        "UPDATE VIDEO ERROR =>",
        error,
      );

      setUploadProgress(0);
      setIsFinalizing(false);

      toast.error(
        t("toast.error"),
      );
    }
  };

  if (loading) {
    return (
      <div className="border-border-secondary bg-secondary-bg flex min-h-[620px] items-center justify-center border">
        <div className="flex items-center gap-3">
          <LoaderCircle
            className="text-custom-primary size-5 animate-spin"
            strokeWidth={1.8}
          />

          <span className="text-muted-foreground text-sm">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit,
        )
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
              {t(
                "header.title",
              )}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t(
                "header.description",
              )}
            </p>
          </div>
        </div>

        <div
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

          {/* Optional Video */}
          <Controller
            control={control}
            name="video"
            render={({ field }) => (
              <VideoUploadField
                value={
                  field.value
                }
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

          <div className="border-border-secondary bg-background border px-5 py-4">
            <p className="text-muted-foreground text-sm leading-6">
              {t(
                "form.videoHint",
              )}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="border-border-secondary mt-10 flex justify-end border-t pt-6">
          <button
            type="submit"
            disabled={
              isSubmitting
            }
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
                ? t(
                    "form.submitting",
                  )
                : t(
                    "form.submit",
                  )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditVideoForm;