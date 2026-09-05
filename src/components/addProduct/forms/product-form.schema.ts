import { z } from "zod";

export const createProductSchema = (t: (key: string) => string) =>
  z.object({
    name_en: z
      .string()
      .trim()
      .min(1, t("validation.nameEnRequired")),

    name_fa: z
      .string()
      .trim()
      .min(1, t("validation.nameFaRequired")),

    description_en: z.string().trim(),

    description_fa: z.string().trim(),

    brand_id: z
      .number()
      .int()
      .positive(t("validation.brandRequired")),

    image: z
      .custom<File>((value) => value instanceof File, {
        message: t("validation.imageRequired"),
      })
      .refine(
        (file) => file instanceof File && file.type.startsWith("image/"),
        {
          message: t("validation.imageInvalid"),
        },
      ),
  });

export type ProductFormValues = z.infer<
  ReturnType<typeof createProductSchema>
>;