"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Layers3 } from "lucide-react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomToast } from "@/components/ui/custom-toast";

import LanguageSelect from "../LanguageSelect";
import SubmitButton from "../SubmitButton";
import RootNewsSelect from "../RootNewsSelect";
import { CategorySelect } from "../CategorySelect";
import { TagSelector } from "../TagSelector";

import { ParentNewsFormValues, parentNewsSchema } from "../parent-news.schema";

import { tags } from "../data";

interface Category {
  id: number;
  name: string;
}

const ParentNewsForm = () => {
  const t = useTranslations("addNews");
  const locale = useLocale();
  const toast = useCustomToast();

  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParentNewsFormValues>({
    resolver: zodResolver(parentNewsSchema(t)),
    defaultValues: {
      root_blog: 0,
      category: "",
      title: "",
      description: "",
      image: "",
      lang: "fa",
      tags: [],
    },
  });

  const lang = watch("lang");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/blog/category/${lang}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await res.json();

        const sortedData = [...data].sort((a, b) => b.id - a.id);

        setCategories(sortedData);
      } catch (error) {
        console.error("FETCH NEWS CATEGORIES ERROR =>", error);
      }
    };

    fetchCategories();
  }, [lang]);

  const onSubmit = async (data: ParentNewsFormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      image: data.image,
      category: data.category,
      root_blog: data.root_blog,
      tags: data.tags.map((item) => item.label),
      lang: data.lang,
    };

    try {
      const res = await fetch("/api/blog/parent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error ?? t("toast.parentNews.error"));

        return;
      }

      toast.success(t("toast.parentNews.success"));

      reset({
        root_blog: 0,
        category: "",
        title: "",
        description: "",
        image: "",
        lang: "fa",
        tags: [],
      });
    } catch (error) {
      console.error("CREATE PARENT NEWS ERROR =>", error);

      toast.error(t("toast.parentNews.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[650px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <Layers3 className="text-custom-primary size-5" strokeWidth={1.6} />
          </div>

          <div className="mt-5">
            <h2 className="text-foreground mt-3 text-xl font-semibold">
              {t("header.parentNews.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("header.parentNews.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / NEWS STRUCTURE
        </div>
      </div>

      {/* Fields */}
      <div className="relative min-h-0 p-8 pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="h-[520px] w-full pe-5"
        >
          <div className="flex flex-col gap-y-7 pb-6">
            <Controller
              control={control}
              name="root_blog"
              render={({ field }) => (
                <RootNewsSelect field={field} error={errors.root_blog} />
              )}
            />

            <Controller
              control={control}
              name="lang"
              render={({ field }) => (
                <LanguageSelect value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <CategorySelect
                  label={t("forms.parentNews.category")}
                  options={categories.map((item) => ({
                    label: item.name,
                    value: String(item.id),
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.category}
                />
              )}
            />

            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <TagSelector
                  label={t("forms.parentNews.tags")}
                  options={tags[lang]}
                  lang={lang}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("forms.parentNews.tagsPlaceholder")}
                />
              )}
            />

            <FormField
              label={t("forms.parentNews.title")}
              placeholder={t("forms.parentNews.titlePlaceholder")}
              register={register("title")}
              error={errors.title}
              as="input"
            />

            <FormField
              label={t("forms.parentNews.featuredImage")}
              placeholder={t("forms.parentNews.featuredImagePlaceholder")}
              register={register("image")}
              error={errors.image}
              as="input"
            />

            <FormField
              label={t("forms.parentNews.description")}
              placeholder={t("forms.parentNews.descriptionPlaceholder")}
              register={register("description")}
              error={errors.description}
              as="textarea"
            />
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="border-border-secondary bg-secondary-bg absolute inset-x-8 bottom-0 flex justify-end border-t py-6">
          <SubmitButton current="parentNews" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default ParentNewsForm;
