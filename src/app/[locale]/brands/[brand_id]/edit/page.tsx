"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import EditBrandForm from "@/components/editBrand/forms/EditBrandForm";

const Page = () => {
  const t = useTranslations("editBrand");

  const params = useParams<{
    brand_id: string;
  }>();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <div className="mt-6 flex min-h-0 flex-1">
          <EditBrandForm brandId={params.brand_id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
