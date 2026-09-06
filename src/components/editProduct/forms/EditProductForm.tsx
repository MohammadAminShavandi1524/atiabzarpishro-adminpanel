"use client";

import { useEffect, useRef, useState } from "react";

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

import { useEditProductFormAnimation } from "./useEditProductFormAnimation";

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

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(true);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const schema = z.object({
    name_en: z.string().trim().min(1, t("validation.nameEnRequired")),

    name_fa: z.string().trim().min(1, t("validation.nameFaRequired")),

    description_en: z.string().trim(),

    description_fa: z.string().trim(),

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

  useEditProductFormAnimation({
    formRef,
    locale,
    enabled: !loading,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const product = await getProduct(productId);

        reset({
          name_en: product.name_en,

          name_fa: product.name_fa,

          description_en: product.description_en ?? "",

          description_fa: product.description_fa ?? "",

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

        description_en: data.description_en || null,

        description_fa: data.description_fa || null,

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
      <div className="border-border-secondary bg-secondary-bg flex min-h-0 flex-1 items-center justify-center border">
        <div className="3xl:gap-3 flex items-center gap-3 xl:gap-2.5">
          <LoaderCircle
            className="text-custom-primary 3xl:size-5 size-5 animate-spin xl:size-[18px]"
            strokeWidth={1.8}
          />

          <span className="text-muted-foreground 3xl:text-sm text-sm xl:text-[13px]">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border-secondary bg-secondary-bg 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="edit-product-form-info border-border-secondary 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border-secondary 3xl:size-11 flex size-11 items-center justify-center border xl:size-10">
            <PackageSearch
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="edit-product-form-heading 3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:mt-3 3xl:text-xl mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px]">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.description")}
            </p>
          </div>
        </div>

        <div
          lang="en"
          dir="ltr"
          className="text-muted-foreground/60 3xl:text-[10px] 3xl:tracking-[0.12em] text-[10px] tracking-[0.12em] xl:text-[9px] xl:tracking-[0.1em]"
        >
          ATI / PRODUCT MANAGEMENT
        </div>
      </div>

      {/* Fields */}
      <div className="3xl:p-8 3xl:pe-3 flex min-h-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 flex-1 pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-7 flex flex-col gap-y-7 pb-8 xl:gap-y-5 2xl:gap-y-6">
            {/* Names */}
            <div className="edit-product-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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
            <div className="edit-product-form-field">
              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <BrandSelect field={field} error={errors.brand_id} />
                )}
              />
            </div>

            {/* Descriptions */}
            <div className="edit-product-form-field 3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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
            <div className="edit-product-form-field">
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
            </div>

            {/* Hint */}
            <div className="edit-product-form-field border-border-secondary bg-background 3xl:px-5 3xl:py-4 border px-5 py-4 xl:px-4 xl:py-3 2xl:px-4.5 2xl:py-3.5">
              <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 text-sm leading-6 xl:text-[13px] xl:leading-5">
                {t("form.imageHint")}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="edit-product-form-submit border-border-secondary bg-secondary-bg 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-custom-primary text-primary-foreground 3xl:min-w-[190px] 3xl:px-6 3xl:py-3 3xl:text-sm flex min-w-[190px] cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60 xl:min-w-[165px] xl:px-5 xl:py-2.5 xl:text-[13px] 2xl:min-w-[175px]"
          >
            {isSubmitting && (
              <LoaderCircle
                className="3xl:size-4 size-4 animate-spin xl:size-[15px]"
                strokeWidth={1.8}
              />
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
