"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { z } from "zod";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { FilePenLine } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { cn } from "@/lib/utils";

import NewsImageUploadField from "@/components/addNews/forms/NewsImageUploadField";

import { uploadParentNewsImage } from "@/components/addNews/forms/parent-news-upload";

interface PageProps {
  params: Promise<{
    id: string;

    blogId: string;
  }>;
}

const Page = ({ params }: PageProps) => {
  const t = useTranslations("editChildNews");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const schema = z.object({
    title: z.string().trim().max(100, t("form.validation.titleMax")).optional(),

    description: z.string().trim().optional(),

    image: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          file === undefined ||
          (file instanceof File && file.type.startsWith("image/")),
        {
          message: t("form.validation.imageInvalid"),
        },
      ),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    control,
    reset,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: "",

      description: "",

      image: undefined,
    },
  });

  useEffect(() => {
    const fetchChildNews = async () => {
      const { id, blogId } = await params;

      try {
        const res = await fetch(`/api/blog/child/${blogId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        const news = Array.isArray(data)
          ? data.find((item) => String(item.id) === String(id))
          : null;

        if (!news) {
          throw new Error("Child news not found");
        }

        setCurrentImage(news.image ?? null);

        reset({
          title: news.title ?? "",

          description: news.description ?? "",

          image: undefined,
        });
      } catch (error) {
        console.error("FETCH CHILD NEWS ERROR =>", error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchChildNews();
  }, [params, reset, t, toast]);

  const onSubmit = async (data: FormValues) => {
    const { id } = await params;

    try {
      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      let finalImageUrl = currentImage;

      if (data.image instanceof File) {
        finalImageUrl = await uploadParentNewsImage({
          file: data.image,

          onProgress: setImageUploadProgress,

          onFinalizing: setIsImageFinalizing,
        });
      }

      const payload = {
        title: data.title?.trim() || null,

        description: data.description?.trim() || null,

        image: finalImageUrl || null,
      };

      const res = await fetch(`/api/blog/child/update/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);

        toast.error(result?.error ?? t("toast.error"));

        return;
      }

      toast.success(t("toast.success"));

      router.push(`/${locale}/news`);
    } catch (error) {
      console.error(error);

      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 w-full flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
        >
          {/* Information */}
          <div className="border-border-secondary 3xl:p-7 relative flex min-h-0 min-w-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
            <div className="min-w-0">
              <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
                <FilePenLine
                  className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
                  strokeWidth={1.6}
                />
              </div>

              <div className="3xl:mt-5 mt-5 xl:mt-4">
                <h2 className="text-foreground 3xl:text-xl text-xl font-semibold xl:text-[18px] 2xl:text-[19px]">
                  {t("header.title")}
                </h2>

                <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
                  {t("header.description")}
                </p>
              </div>
            </div>

            <div
              lang="en"
              dir="ltr"
              className="text-muted-foreground/60 3xl:text-[10px] 3xl:tracking-[0.12em] shrink-0 text-[10px] tracking-[0.12em] xl:text-[9px] xl:tracking-[0.1em]"
            >
              ATI / NEWS MANAGEMENT
            </div>
          </div>

          {/* Fields */}
          <div className="3xl:p-8 3xl:pe-3 flex min-h-0 min-w-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
            <ScrollArea
              dir={locale === "en" ? "ltr" : "rtl"}
              className="3xl:pe-5 min-h-0 w-full flex-1 pe-5 xl:pe-4 2xl:pe-4.5"
              scrollBarClassName="me-0"
            >
              <div className="3xl:gap-y-7 flex min-w-0 flex-col gap-y-7 pb-8 xl:gap-y-5 2xl:gap-y-6">
                {/* Title */}
                <div className="min-w-0">
                  <FormField
                    label={t("form.title.label")}
                    placeholder={t("form.title.placeholder")}
                    register={register("title")}
                    error={errors.title}
                    as="input"
                  />
                </div>

                {/* Description */}
                <div className="min-w-0">
                  <FormField
                    label={t("form.description.label")}
                    placeholder={t("form.description.placeholder")}
                    register={register("description")}
                    error={errors.description}
                    as="textarea"
                    className="h-50"
                  />
                </div>

                {/* Current Image */}
                {currentImage && (
                  <div className="min-w-0">
                    <label className="text-foreground mb-2 block text-sm font-medium xl:text-[13px] 2xl:text-sm">
                      {t("form.image.current")}
                    </label>

                    <div className="border-border-secondary bg-background flex items-center gap-4 border p-4">
                      <div className="relative h-24 w-36 shrink-0 overflow-hidden">
                        <Image
                          src={currentImage}
                          alt={t("form.image.current")}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                      </div>

                      <p className="text-muted-foreground text-sm leading-6 xl:text-[13px]">
                        {t("form.image.hint")}
                      </p>
                    </div>
                  </div>
                )}

                {/* New Image */}
                <div className="min-w-0">
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <NewsImageUploadField
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
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
              <CustomButton
                type="submit"
                intent="primary"
                variant="solid"
                disabled={loading || isSubmitting}
                className={cn(
                  "3xl:h-12 3xl:px-6 3xl:text-sm h-12 px-6 text-sm font-semibold xl:h-11 xl:px-5 xl:text-[13px] 2xl:h-[46px] 2xl:text-[14px]",
                  (loading || isSubmitting) && "cursor-not-allowed opacity-60",
                )}
              >
                {isImageFinalizing
                  ? t("form.actions.finalizing")
                  : isSubmitting
                    ? t("form.actions.saving")
                    : t("form.actions.saveChanges")}
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
