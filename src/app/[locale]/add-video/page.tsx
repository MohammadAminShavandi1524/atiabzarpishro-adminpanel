"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import VideoForm from "@/components/addVideo/forms/VideoForm";


const Page = () => {
  const t = useTranslations("addVideo");

  return (
    <div className="flex flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex flex-1 flex-col px-10 pb-10">
        <div className="mt-9">
          <VideoForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
