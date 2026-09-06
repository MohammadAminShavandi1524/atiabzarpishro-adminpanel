"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditTechNewsForm from "@/components/editTechNews/forms/EditTechNewsForm";

const Page = () => {
  const t = useTranslations("editTechNews");

  const params = useParams<{
    news_id: string;
  }>();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <EditTechNewsForm newsId={params.news_id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
