"use client";

import { z } from "zod";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Languages } from "lucide-react";
import { FormField } from "@/components/FormField";
import SubmitButton from "../SubmitButton";
import LanguageSelect from "../LanguageSelect";
import { useCustomToast } from "@/components/ui/custom-toast";

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
      className="border-border-secondary bg-secondary-bg grid min-h-[390px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <Languages
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5">
            

            <h2 className="text-foreground mt-3 text-xl font-semibold">
              {t("header.category.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("header.category.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / NEWS CATEGORY
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col justify-between p-8">
        <div className="space-y-7">
          <Controller
            control={control}
            name="lang"
            render={({ field }) => (
              <LanguageSelect value={field.value} onChange={field.onChange} />
            )}
          />

          <FormField
            label={t("forms.category.label")}
            placeholder={t("forms.category.placeholder")}
            register={register("title")}
            error={errors.title}
            as="input"
          />
        </div>

        <div className="border-border-secondary mt-10 flex justify-end border-t pt-6">
          <SubmitButton current="category" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
