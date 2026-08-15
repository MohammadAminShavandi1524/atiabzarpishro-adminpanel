import { z } from "zod";

export const newsSchema = (t: (key: string) => string) =>
  z.object({
    parent_blog: z
      .number()
      .min(1, t("forms.news.validation.parentNewsRequired")),

    title: z.string().min(1, t("forms.news.validation.titleRequired")),

    description: z
      .string()
      .min(1, t("forms.news.validation.descriptionRequired")),

    image: z
      .string()
      .url(t("forms.news.validation.imageInvalid"))
      .or(z.literal("")),
  });

export type NewsFormValues = z.infer<ReturnType<typeof newsSchema>>;
