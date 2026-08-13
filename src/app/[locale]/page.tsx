import HeaderLayout from "@/components/layout/HeaderLayout";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { use } from "react";

export default function IndexPage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale as Locale);

  return (
    <div className="h-250">
      <HeaderLayout title="" descrption="" />
    </div>
  );
}
