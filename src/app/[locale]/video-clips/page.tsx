"use client";

import HeaderLayout from "@/components/layout/HeaderLayout";
import VideoClipsTable from "@/components/videoClips/VideoClipsTable";

import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("VideoClips")

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <VideoClipsTable />
      </div>
    </div>
  );
};

export default Page;
