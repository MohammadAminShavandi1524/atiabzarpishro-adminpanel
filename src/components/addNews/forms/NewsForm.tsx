"use client";

import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Newspaper } from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import SubmitButton from "../SubmitButton";

import { NewsFormValues, newsSchema } from "../news.schema";

import ParentNewsSelect from "../ParentNewsSelect";

import NewsImageUploadField from "./NewsImageUploadField";

import { uploadParentNewsImage } from "./parent-news-upload";

const NewsForm = () => {
  const t = useTranslations("addNews");

  const locale = useLocale();

  const toast = useCustomToast();

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema(t)),

    defaultValues: {
      parent_blog: 0,

      title: "",

      description: "",

      image: undefined,
    },
  });

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      let imageUrl: string | null = null;

      if (data.image instanceof File) {
        imageUrl = await uploadParentNewsImage({
          file: data.image,

          onProgress: setImageUploadProgress,

          onFinalizing: setIsImageFinalizing,
        });
      }

      const payload = {
        blog_id: Number(data.parent_blog),

        title: data.title?.trim() || null,

        description: data.description?.trim() || null,

        image: imageUrl,
      };

      const res = await fetch("/api/blog/child", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error ?? t("toast.news.error"));

        return;
      }

      toast.success(t("toast.news.success"));

      reset({
        parent_blog: 0,

        title: "",

        description: "",

        image: undefined,
      });

      setImageUploadProgress(0);

      setIsImageFinalizing(false);
    } catch (error) {
      console.error("CREATE NEWS ERROR =>", error);

      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      toast.error(t("toast.news.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid h-full max-h-full min-h-0 w-full flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="border-border-secondary 3xl:p-7 relative flex min-h-0 min-w-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div className="min-w-0">
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <Newspaper
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:mt-3 3xl:text-xl mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px]">
              {t("header.news.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.news.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 3xl:text-[10px] 3xl:tracking-[0.12em] shrink-0 text-[10px] tracking-[0.12em] xl:text-[9px] xl:tracking-[0.1em]"
        >
          ATI / NEWS CONTENT
        </div>
      </div>

      {/* Fields */}
      <div className="3xl:p-8 3xl:pe-3 flex h-full max-h-full min-h-0 min-w-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 w-full flex-1 overflow-hidden pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-7 flex min-w-0 flex-col gap-y-7 pb-4 xl:gap-y-5 2xl:gap-y-6">
            {/* Parent News */}
            <div className="min-w-0">
              <Controller
                control={control}
                name="parent_blog"
                render={({ field }) => (
                  <ParentNewsSelect field={field} error={errors.parent_blog} />
                )}
              />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <FormField
                label={t("forms.news.title")}
                placeholder={t("forms.news.titlePlaceholder")}
                register={register("title")}
                error={errors.title}
                as="input"
              />
            </div>

            {/* Description */}
            <div className="min-w-0">
              <FormField
                label={t("forms.news.description")}
                placeholder={t("forms.news.descriptionPlaceholder")}
                register={register("description")}
                error={errors.description}
                as="textarea"
              />
            </div>

            {/* Featured Image */}
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
          <SubmitButton current="news" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default NewsForm;
