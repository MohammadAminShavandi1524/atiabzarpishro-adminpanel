"use client";

import { useEffect, useState } from "react";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoaderCircle, PackageSearch } from "lucide-react";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import BrandSelect from "@/components/addProduct/BrandSelect";

import ProductImageUploadField from "@/components/addProduct/ProductImageUploadField";

import { getProduct } from "../get-product.api";

import {
  updateProduct,
  type UpdateProductPayload,
} from "../update-product.api";

interface EditProductFormProps {
  productId: string;
}

interface UploadResponse {
  success: boolean;

  url: string;
}

const EditProductForm = ({ productId }: EditProductFormProps) => {
  const t = useTranslations("editProduct");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const schema = z.object({
    name_en: z.string().trim().min(1, t("validation.nameEnRequired")),

    name_fa: z.string().trim().min(1, t("validation.nameFaRequired")),

    description_en: z
      .string()
      .trim()
      .min(1, t("validation.descriptionEnRequired")),

    description_fa: z
      .string()
      .trim()
      .min(1, t("validation.descriptionFaRequired")),

    brand_id: z.number().int().positive(t("validation.brandRequired")),

    image: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith("image/")),
        {
          message: t("validation.imageInvalid"),
        },
      ),
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
      name_en: "",

      name_fa: "",

      description_en: "",

      description_fa: "",

      brand_id: 0,

      image: undefined,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const product = await getProduct(productId);

        reset({
          name_en: product.name_en,

          name_fa: product.name_fa,

          description_en: product.description_en,

          description_fa: product.description_fa,

          brand_id: product.brand.id,

          image: undefined,
        });
      } catch (error) {
        console.error("GET PRODUCT ERROR =>", error);

        toast.error(t("toast.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, reset, t, toast]);

  const uploadFile = ({
    file,
    url,
    onProgress,
    onFinalizing,
  }: {
    file: File;

    url: string;

    onProgress: (value: number) => void;

    onFinalizing: (value: boolean) => void;
  }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", url);

      xhr.upload.onloadstart = () => {
        onProgress(0);

        onFinalizing(false);
      };

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return;
        }

        const rawProgress = Math.round((event.loaded / event.total) * 100);

        onProgress(Math.min(rawProgress, 95));
      };

      xhr.upload.onload = () => {
        onProgress(95);

        onFinalizing(true);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          onFinalizing(false);

          reject(new Error("Upload failed"));

          return;
        }

        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);

          if (!response.url) {
            throw new Error("URL not returned");
          }

          onProgress(100);

          onFinalizing(false);

          resolve(response.url);
        } catch {
          onFinalizing(false);

          reject(new Error("Invalid upload response"));
        }
      };

      xhr.onerror = () => {
        onFinalizing(false);

        reject(new Error("Upload failed"));
      };

      xhr.onabort = () => {
        onFinalizing(false);

        reject(new Error("Upload aborted"));
      };

      xhr.send(formData);
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      const imageUrl = data.image
        ? await uploadFile({
            file: data.image,

            url: "/api/product/upload-image",

            onProgress: setImageUploadProgress,

            onFinalizing: setIsImageFinalizing,
          })
        : null;

      const payload: UpdateProductPayload = {
        name_en: data.name_en,

        name_fa: data.name_fa,

        description_en: data.description_en,

        description_fa: data.description_fa,

        brand_id: data.brand_id,

        image: imageUrl,
      };

      await updateProduct(productId, payload);

      toast.success(t("toast.updateSuccess"));

      router.push(`/${locale}/products`);
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR =>", error);

      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      toast.error(t("toast.error"));
    }
  };

  if (loading) {
    return (
      <div className="border-border-secondary bg-secondary-bg flex min-h-[650px] items-center justify-center border">
        <div className="flex items-center gap-3">
          <LoaderCircle
            className="text-custom-primary size-5 animate-spin"
            strokeWidth={1.8}
          />

          <span className="text-muted-foreground text-sm">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg grid min-h-[650px] grid-cols-[0.36fr_1fr] overflow-hidden border"
    >
      {/* Information */}
      <div className="border-border-secondary relative flex flex-col justify-between border-e p-7">
        <div>
          <div className="border-border-secondary flex size-11 items-center justify-center border">
            <PackageSearch
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5">
            <h2 className="text-foreground mt-3 text-xl font-semibold">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7">
              {t("header.description")}
            </p>
          </div>
        </div>

        <div
          lang="en"
          dir="ltr"
          className="text-muted-foreground/60 text-[10px] tracking-[0.12em]"
        >
          ATI / PRODUCT MANAGEMENT
        </div>
      </div>

      {/* Fields */}
      <div className="relative min-h-0 p-8 pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="h-[520px] w-full pe-5"
          scrollBarClassName="me-0"
        >
          <div className="flex flex-col gap-y-7 pb-2">
            {/* Names */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label={t("form.nameEn.label")}
                placeholder={t("form.nameEn.placeholder")}
                register={register("name_en")}
                error={errors.name_en}
                as="input"
              />

              <FormField
                label={t("form.nameFa.label")}
                placeholder={t("form.nameFa.placeholder")}
                register={register("name_fa")}
                error={errors.name_fa}
                as="input"
              />
            </div>

            {/* Brand */}
            <Controller
              control={control}
              name="brand_id"
              render={({ field }) => (
                <BrandSelect field={field} error={errors.brand_id} />
              )}
            />

            {/* Descriptions */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label={t("form.descriptionEn.label")}
                placeholder={t("form.descriptionEn.placeholder")}
                register={register("description_en")}
                error={errors.description_en}
                as="textarea"
              />

              <FormField
                label={t("form.descriptionFa.label")}
                placeholder={t("form.descriptionFa.placeholder")}
                register={register("description_fa")}
                error={errors.description_fa}
                as="textarea"
              />
            </div>

            {/* Optional New Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ProductImageUploadField
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

            {/* Hint */}
            <div className="border-border-secondary bg-background border px-5 py-4">
              <p className="text-muted-foreground text-sm leading-6">
                {t("form.imageHint")}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="border-border-secondary bg-secondary-bg absolute inset-x-8 bottom-0 flex justify-end border-t py-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-custom-primary text-primary-foreground flex min-w-[190px] cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.8} />
            )}

            {isImageFinalizing
              ? t("form.finalizing")
              : isSubmitting
                ? t("form.submitting")
                : t("form.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProductForm;
