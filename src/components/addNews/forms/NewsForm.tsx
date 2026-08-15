"use client";

import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Newspaper } from "lucide-react";
import { FormField } from "@/components/FormField";
import { useCustomToast } from "@/components/ui/custom-toast";
import SubmitButton from "../SubmitButton";
import { NewsFormValues, newsSchema } from "../news.schema";
import ParentNewsSelect from "../ParentNewsSelect";

const NewsForm = () => {
  const t = useTranslations("addNews");
  const toast = useCustomToast();

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
      image: "",
    },
  });

  const onSubmit = async (data: NewsFormValues) => {
    try {
      const payload = {
        blog_id: Number(data.parent_blog),
        title: data.title || null,
        description: data.description || null,
        image: data.image || null,
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
        image: "",
      });
    } catch (error) {
      console.error("CREATE NEWS ERROR =>", error);

      toast.error(t("toast.news.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[500px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <Newspaper
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5">
            <h2 className="text-foreground mt-3 text-xl font-semibold">
              {t("header.news.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("header.news.description")}
            </p>
          </div>
        </div>

        <div
          lang="en"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / NEWS CONTENT
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col justify-between p-8">
        <div className="flex flex-col gap-y-7">
          <Controller
            control={control}
            name="parent_blog"
            render={({ field }) => (
              <ParentNewsSelect field={field} error={errors.parent_blog} />
            )}
          />

          <FormField
            label={t("forms.news.title")}
            placeholder={t("forms.news.titlePlaceholder")}
            register={register("title")}
            error={errors.title}
            as="input"
          />

          <FormField
            label={t("forms.news.description")}
            placeholder={t("forms.news.descriptionPlaceholder")}
            register={register("description")}
            error={errors.description}
            as="textarea"
          />

          <div className="hidden">
            <FormField
              label={t("forms.news.featuredImage")}
              placeholder={t("forms.news.featuredImagePlaceholder")}
              register={register("image")}
              error={errors.image}
              as="input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-border-secondary mt-10 flex justify-end border-t pt-6">
          <SubmitButton current="news" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default NewsForm;
