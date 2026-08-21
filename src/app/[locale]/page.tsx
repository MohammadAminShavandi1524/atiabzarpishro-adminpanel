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

      <div className="flex flex-1 flex-col px-8 py-6">
        <DashboardPage />
      </div>
    </div>
  );
}
