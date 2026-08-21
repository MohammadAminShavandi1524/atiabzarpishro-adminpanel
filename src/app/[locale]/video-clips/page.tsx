"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import VideosTable from "@/components/videos/VideosTable";

const Page = () => {
  const t = useTranslations("Videos");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <VideosTable />
      </div>
    </div>
  );
};

export default Page;
