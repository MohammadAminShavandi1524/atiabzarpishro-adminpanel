"use client";

import { z } from "zod";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FileText } from "lucide-react";

import { FormField } from "@/components/FormField";

import SubmitButton from "../SubmitButton";
import { useCustomToast } from "@/components/ui/custom-toast";

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
      className="border-border-secondary bg-secondary-bg grid min-h-[390px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <FileText
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-7">
            <div
              lang="en"
              className="text-custom-primary text-[10px] tracking-[0.14em]"
            >
              ROOT / 01
            </div>

            <h2 className="text-foreground mt-3 text-xl font-semibold">
              {t("header.rootNews.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("header.rootNews.description")}
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
      <div className="flex flex-col justify-between p-8">
        <FormField
          label={t("forms.rootNews.title")}
          placeholder={t("forms.rootNews.titlePlaceholder")}
          register={register("title")}
          error={errors.title}
          as="input"
        />

        <div className="border-border-secondary mt-10 flex justify-end border-t pt-6">
          <SubmitButton current="rootNews" disabled={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default RootNewsForm;
