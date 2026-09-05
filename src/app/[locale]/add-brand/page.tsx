"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import BrandForm from "@/components/addBrand/forms/BrandForm";

const Page = () => {
  const t = useTranslations("addBrand");

  return (
    <div className="flex flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-10 3xl:pb-10 flex flex-1 flex-col px-10 pb-10 xl:px-6 xl:pb-6 2xl:px-8 2xl:pb-8">
        <div className="3xl:mt-9 mt-9 xl:mt-6 2xl:mt-7">
          <BrandForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
