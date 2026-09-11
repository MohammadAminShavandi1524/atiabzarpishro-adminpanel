import { z } from "zod";

export const newsSchema = (t: (key: string) => string) =>
  z.object({
    parent_blog: z
      .number()
      .min(1, t("forms.news.validation.parentNewsRequired")),

    title: z.string().trim().optional(),

    description: z.string().trim().optional(),

    image: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          file === undefined ||
          (file instanceof File && file.type.startsWith("image/")),
        {
          message: t("forms.news.validation.imageInvalid"),
        },
      ),
  });

export type NewsFormValues = z.infer<ReturnType<typeof newsSchema>>;
