"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditVideoForm from "@/components/editVideo/forms/EditVideoForm";

const Page = () => {
  const t = useTranslations("editVideo");

  const params = useParams<{
    id: string;
  }>();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("pageHeader.title")}
        descrption={t("pageHeader.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <EditVideoForm videoId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
