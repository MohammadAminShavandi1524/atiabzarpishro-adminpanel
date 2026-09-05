import { use } from "react";

import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import HeaderLayout from "@/components/layout/HeaderLayout";
import DashboardPage from "@/components/dashboard/DashboardPage";

export default function IndexPage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);

  const t = useTranslations("Dashboard");

  setRequestLocale(locale as Locale);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex flex-1 flex-col px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <DashboardPage />
      </div>
    </div>
  );
}
