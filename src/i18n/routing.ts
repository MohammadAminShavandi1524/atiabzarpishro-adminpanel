import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "fa",
  pathnames: {
    "/": "/",
    "/pathnames": {
      fa: "/مسیرها",
    },
  },
});
