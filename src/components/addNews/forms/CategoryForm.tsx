"use client";

import { z } from "zod";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { Languages } from "lucide-react";

import { FormField } from "@/components/FormField";

import { useCustomToast } from "@/components/ui/custom-toast";

import SubmitButton from "../SubmitButton";

import LanguageSelect from "../LanguageSelect";

const CategoryForm = () => {
  const t = useTranslations("addNews");

  const toast = useCustomToast();

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t("forms.category.validation.required"))
      .max(30, t("forms.category.validation.max")),

    lang: z.enum(["fa", "en"], {
      required_error: t("forms.category.validation.language"),
      invalid_type_error: t("forms.category.validation.language"),
    }),
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
      title: "",

      lang: "fa",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/blog/category", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: data.title,

          lang: data.lang,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      toast.success(t("toast.category.success"));

      reset({
        title: "",

        lang: "fa",
      });
    } catch (error) {
      console.error("CREATE NEWS CATEGORY ERROR =>", error);

      toast.error(t("toast.category.error"));
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
            <Languages
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:mt-3 3xl:text-xl mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px]">
              {t("header.category.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.category.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 3xl:text-[10px] 3xl:tracking-[0.12em] shrink-0 text-[10px] tracking-[0.12em] xl:text-[9px] xl:tracking-[0.1em]"
        >
          ATI / NEWS CATEGORY
        </div>
      </div>

      {/* Fields */}
      <div className="3xl:p-8 flex h-full max-h-full min-h-0 min-w-0 flex-col overflow-hidden p-8 xl:p-5 2xl:p-6">
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          <div className="3xl:space-y-7 w-full space-y-7 xl:space-y-5 2xl:space-y-6">
            {/* Language */}
            <div className="min-w-0">
              <Controller
                control={control}
                name="lang"
                render={({ field }) => (
                  <LanguageSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <FormField
                label={t("forms.category.label")}
                placeholder={t("forms.category.placeholder")}
                register={register("title")}
                error={errors.title}
                as="input"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <SubmitButton current="category" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
