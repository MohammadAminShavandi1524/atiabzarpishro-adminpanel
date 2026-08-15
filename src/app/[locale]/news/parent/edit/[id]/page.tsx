"use client";

import { useEffect, useState } from "react";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FilePenLine } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { FormField } from "@/components/FormField";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import { cn } from "@/lib/utils";

import { tags } from "@/components/addNews/data";
import { CategorySelect } from "@/components/addNews/CategorySelect";
import { TagSelector } from "@/components/addNews/TagSelector";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ParentNews {
  id: number;
  title: string;
  description: string;
  image: string;

  category: {
    id: number;
    name: string;
  };

  root_blog: number;

  tags: string[];

  lang: string;
}

type NewsLang = "fa" | "en";

interface Category {
  id: number;
  name: string;
}

const Page = ({ params }: PageProps) => {
  const t = useTranslations("editParentNews");

  const locale = useLocale();
  const router = useRouter();
  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsLang, setNewsLang] = useState<NewsLang>("fa");

  const [parentMeta, setParentMeta] = useState<{
    root_blog: string;
    lang: NewsLang;
  } | null>(null);

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t("form.validation.titleRequired"))
      .max(100, t("form.validation.titleMax")),

    description: z.string().min(1, t("form.validation.descriptionRequired")),

    image: z.string(),

    category: z.string().min(1, t("form.validation.categoryRequired")),

    tags: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
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
      image: "",
      category: "",
      tags: [],
    },
  });

  useEffect(() => {
    const fetchNews = async () => {
      const { id } = await params;

      try {
        const res = await fetch(`/api/blog/parent/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error();
        }

        const data: ParentNews = await res.json();

        const lang: NewsLang = data.lang === "en" ? "en" : "fa";

        setNewsLang(lang);

        setParentMeta({
          root_blog: String(data.root_blog),
          lang,
        });

        const categoryRes = await fetch(`/api/blog/category/${lang}`, {
          cache: "no-store",
        });

        if (!categoryRes.ok) {
          throw new Error();
        }

        const categoryData: Category[] = await categoryRes.json();

        setCategories(categoryData);

        reset({
          title: data.title,

          description: data.description ?? "",

          image: data.image ?? "",

          category: String(data.category.id),

          tags:
            data.tags?.map((tag) => {
              const foundTag = tags[lang].find((item) => item.label === tag);

              return (
                foundTag ?? {
                  id: tag,
                  label: tag,
                }
              );
            }) ?? [],
        });
      } catch (error) {
        console.error(error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params, reset, t]);

  const onSubmit = async (data: FormValues) => {
    const { id } = await params;

    if (!parentMeta) {
      toast.error(t("toast.error"));
      return;
    }

    const payload = {
      title: data.title,

      description: data.description,

      image: data.image,

      tags: data.tags.map((item) => item.label),

      root_blog: parentMeta.root_blog,

      category: String(data.category),

      lang: parentMeta.lang,
    };

    try {
      const res = await fetch(`/api/blog/parent/update/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("UPDATE ERROR =>", result);

        toast.error(result?.error ?? t("toast.error"));

        return;
      }

      toast.success(t("toast.success"));

      router.push(`/${locale}/news`);
    } catch (error) {
      console.error(error);

      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex flex-1 flex-col px-10 pb-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-border-secondary bg-secondary-bg grid flex-1 grid-cols-[0.36fr_1fr] overflow-hidden border"
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
                  {t("header.title")}
                </h2>

                <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
                  {t("header.description")}
                </p>
              </div>
            </div>

            <div
              lang="en"
              className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
            >
              ATI / NEWS MANAGEMENT
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col justify-between p-8">
            <div className="flex flex-col gap-7">
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <CategorySelect
                    label={t("form.category.label")}
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
                    label={t("form.tags.label")}
                    options={tags[newsLang]}
                    lang={newsLang}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("form.tags.placeholder")}
                  />
                )}
              />

              <FormField
                label={t("form.title.label")}
                placeholder={t("form.title.placeholder")}
                register={register("title")}
                error={errors.title}
                as="input"
              />

              <FormField
                label={t("form.image.label")}
                placeholder={t("form.image.placeholder")}
                register={register("image")}
                error={errors.image}
                as="input"
              />

              <FormField
                label={t("form.description.label")}
                placeholder={t("form.description.placeholder")}
                register={register("description")}
                error={errors.description}
                as="textarea"
              />
            </div>

            {/* Actions */}
            <div className="border-border-secondary mt-10 flex justify-end border-t pt-6">
              <CustomButton
                type="submit"
                intent="primary"
                variant="solid"
                disabled={loading || isSubmitting}
                className={cn(
                  "h-12 px-6 font-semibold",
                  (loading || isSubmitting) && "cursor-not-allowed opacity-60",
                )}
              >
                {isSubmitting
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
