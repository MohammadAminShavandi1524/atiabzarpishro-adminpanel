"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import EditVideoForm from "@/components/videoClips/EditVideoForm";


const Page = () => {
  const t = useTranslations("editVideo");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("pageHeader.title")}
        descrption={t("pageHeader.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <EditVideoForm />
      </div>
    </div>
  );
};

export default Page;
