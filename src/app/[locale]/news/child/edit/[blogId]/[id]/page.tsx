"use client";

import { useEffect, useState } from "react";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FilePenLine } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { FormField } from "@/components/FormField";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import { cn } from "@/lib/utils";

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

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t("form.validation.titleRequired"))
      .max(100, t("form.validation.titleMax")),

    description: z
      .string()
      .trim()
      .min(1, t("form.validation.descriptionRequired")),

    image: z.string().optional(),
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
      title: "",
      description: "",
      image: "",
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

        reset({
          title: news.title ?? "",
          description: news.description ?? "",
          image: news.image ?? "",
        });
      } catch (error) {
        console.error("FETCH CHILD NEWS ERROR =>", error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchChildNews();
  }, [params, reset, t]);

  const onSubmit = async (data: FormValues) => {
    const { id } = await params;

    const payload = {
      title: data.title,
      description: data.description,
      image: data.image?.trim() ? data.image : null,
    };

    try {
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
              <FormField
                label={t("form.title.label")}
                placeholder={t("form.title.placeholder")}
                register={register("title")}
                error={errors.title}
                as="input"
              />

              <div className="hidden">
                <FormField
                  label={t("form.image.label")}
                  placeholder={t("form.image.placeholder")}
                  register={register("image")}
                  error={errors.image}
                  as="input"
                />
              </div>

              <FormField
                label={t("form.description.label")}
                placeholder={t("form.description.placeholder")}
                register={register("description")}
                error={errors.description}
                as="textarea"
                className="h-50"
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
