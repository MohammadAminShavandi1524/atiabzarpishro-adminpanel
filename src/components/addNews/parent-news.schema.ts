import { z } from "zod";

export const parentNewsSchema = (t: (key: string) => string) =>
  z.object({
    root_blog: z
      .number()
      .min(1, t("forms.parentNews.validation.rootNewsRequired")),

    category: z
      .string()
      .min(1, t("forms.parentNews.validation.categoryRequired")),

    lang: z.enum(["fa", "en"]),

    tags: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
        }),
      )
      .min(1, t("forms.parentNews.validation.tagsRequired")),

    title: z
      .string()
      .trim()
      .min(1, t("forms.parentNews.validation.titleRequired")),

    description: z
      .string()
      .trim()
      .min(1, t("forms.parentNews.validation.descriptionRequired")),

    image: z
      .string()
      .trim()
      .url(t("forms.parentNews.validation.imageInvalid"))
      .or(z.literal("")),
  });

export type ParentNewsFormValues = z.infer<ReturnType<typeof parentNewsSchema>>;
