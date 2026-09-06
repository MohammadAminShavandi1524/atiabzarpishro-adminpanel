"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import BrandForm from "@/components/addBrand/forms/BrandForm";

const Page = () => {
  const t = useTranslations("addBrand");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <BrandForm />
        </div>
      </div>
    </div>
  );
};

export default Page;