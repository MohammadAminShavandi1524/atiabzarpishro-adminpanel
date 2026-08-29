import { z } from "zod";

type Translate = (key: string) => string;

export const editTechNewsSchema = (
  t: Translate,
  currentObjectStorage: boolean,
) =>
  z
    .object({
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

      source: z.enum(["upload", "url"]),

      pdf: z.custom<File | undefined>().optional(),

      external_url: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === "upload") {
        if (data.pdf instanceof File && data.pdf.type !== "application/pdf") {
          ctx.addIssue({
            code: "custom",
            path: ["pdf"],
            message: t("validation.pdfInvalid"),
          });
        }

        /*
         * قبلاً URL خارجی بوده و حالا کاربر
         * Source را روی Upload گذاشته.
         *
         * در این حالت حتماً باید PDF جدید بدهد.
         */
        if (!currentObjectStorage && !(data.pdf instanceof File)) {
          ctx.addIssue({
            code: "custom",
            path: ["pdf"],
            message: t("validation.pdfRequiredOnSourceChange"),
          });
        }
      }

      if (data.source === "url") {
        const url = data.external_url?.trim() ?? "";

        if (!url) {
          ctx.addIssue({
            code: "custom",
            path: ["external_url"],
            message: t("validation.urlRequired"),
          });

          return;
        }

        try {
          const parsedUrl = new URL(url);

          if (
            parsedUrl.protocol !== "http:" &&
            parsedUrl.protocol !== "https:"
          ) {
            throw new Error();
          }
        } catch {
          ctx.addIssue({
            code: "custom",
            path: ["external_url"],
            message: t("validation.urlInvalid"),
          });
        }
      }
    });

export type EditTechNewsFormValues = z.infer<
  ReturnType<typeof editTechNewsSchema>
>;
