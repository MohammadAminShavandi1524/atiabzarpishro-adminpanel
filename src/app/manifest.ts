import { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "Manifest",
  });

  return {
    name: t("name"),
    short_name: t("shortName"),
    description: t("description"),

    id: "/",
    start_url: "/",
    scope: "/",

    display: "standalone",

    theme_color: "#101E33",
    background_color: "#101E33",

    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
