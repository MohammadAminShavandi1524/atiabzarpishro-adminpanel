"use client";

import { useEffect, useState } from "react";

import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tags } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { FormField } from "@/components/FormField";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

interface Category {
  id: number;
  name: string;
}

const Page = ({ params }: PageProps) => {
  const t = useTranslations("editCategory");
  const locale = useLocale();
  const router = useRouter();
  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, t("form.validation.required"))
      .max(30, t("form.validation.max")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  // get category
  useEffect(() => {
    const getCategory = async () => {
      const { lang, id } = await params;

      try {
        const res = await fetch(`/api/blog/category/${lang}`);

        if (!res.ok) {
          throw new Error();
        }

        const data: Category[] = await res.json();

        const category = data.find((item) => item.id === Number(id));

        if (category) {
          reset({
            name: category.name,
          });
        }
      } catch (error) {
        console.error(error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [params, reset, t]);

  // update category
  const onSubmit = async (data: FormValues) => {
    const { lang, id } = await params;

    try {
      const res = await fetch(`/api/blog/category/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          lang,
        }),
      });

      if (!res.ok) {
        throw new Error();
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
          <div className="border-border-secondary flex flex-col justify-between border-e p-7">
            <div>
              <div className="border-border-secondary flex size-11 items-center justify-center border">
                <Tags
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
            <FormField
              label={t("form.name.label")}
              placeholder={t("form.name.placeholder")}
              register={register("name")}
              error={errors.name}
              as="input"
              className="font-IRANYekanX"
            />

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
