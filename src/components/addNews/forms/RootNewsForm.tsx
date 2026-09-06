"use client";

import { z } from "zod";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { FileText } from "lucide-react";

import { FormField } from "@/components/FormField";

import { useCustomToast } from "@/components/ui/custom-toast";

import SubmitButton from "../SubmitButton";

const RootNewsForm = () => {
  const t = useTranslations("addNews");

  const toast = useCustomToast();

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t("forms.rootNews.validation.required"))
      .max(255, t("forms.rootNews.validation.max")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/blog/root", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: data.title,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create root news");
      }

      reset();

      toast.success(t("toast.rootNews.success"));
    } catch (error) {
      console.error("CREATE ROOT NEWS ERROR =>", error);

      toast.error(t("toast.rootNews.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid h-full max-h-full min-h-0 w-full flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr] 3xl:grid-cols-[0.36fr_1fr]"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex min-h-0 min-w-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6 3xl:p-7">
        <div className="min-w-0">
          <div className="border-border-secondary flex size-11 items-center justify-center border xl:size-10 3xl:size-11">
            <FileText
              className="text-custom-primary size-5 xl:size-[18px] 3xl:size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5 xl:mt-4 3xl:mt-5">
            <h2 className="text-foreground mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px] 3xl:mt-3 3xl:text-xl">
              {t("header.rootNews.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px] 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7">
              {t("header.rootNews.description")}
            </p>
          </div>
        </div>

        <div
          dir="ltr"
          lang="en"
          className="text-muted-foreground/60 shrink-0 text-[10px] tracking-[0.12em] xl:text-[9px] xl:tracking-[0.1em] 3xl:text-[10px] 3xl:tracking-[0.12em]"
        >
          ATI / NEWS STRUCTURE
        </div>
      </div>

      {/* Fields */}
      <div className="flex h-full max-h-full min-h-0 min-w-0 flex-col overflow-hidden p-8 xl:p-5 2xl:p-6 3xl:p-8">
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          <div className="min-w-0">
            <FormField
              label={t("forms.rootNews.title")}
              placeholder={t("forms.rootNews.titlePlaceholder")}
              register={register("title")}
              error={errors.title}
              as="input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-border-secondary bg-secondary-bg mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5 3xl:mt-5 3xl:pt-6">
          <SubmitButton current="rootNews" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default RootNewsForm;