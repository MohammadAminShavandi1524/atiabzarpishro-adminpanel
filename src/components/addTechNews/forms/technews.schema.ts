import { z } from "zod";

type Translate = (key: string) => string;

export const createTechNewsSchema = (t: Translate) =>
  z
    .object({
      name_en: z.string().trim().min(1, t("validation.nameEnRequired")),

      name_fa: z.string().trim().min(1, t("validation.nameFaRequired")),

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

      source: z.enum(["upload", "url"]),

      pdf: z.custom<File | undefined>().optional(),

      external_url: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === "upload") {
        if (!(data.pdf instanceof File)) {
          ctx.addIssue({
            code: "custom",

            path: ["pdf"],

            message: t("validation.pdfRequired"),
          });

          return;
        }

        if (data.pdf.type !== "application/pdf") {
          ctx.addIssue({
            code: "custom",

            path: ["pdf"],

            message: t("validation.pdfInvalid"),
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

export type TechNewsFormValues = z.infer<
  ReturnType<typeof createTechNewsSchema>
>;
