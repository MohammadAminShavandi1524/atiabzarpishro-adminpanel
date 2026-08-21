"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditProductForm from "@/components/editProduct/forms/EditProductForm";

const Page = () => {
  const t = useTranslations("editProduct");

  const params = useParams<{
    productId: string;
  }>();

  return (
    <div className="flex flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex flex-1 flex-col px-10 pb-10">
        <div className="mt-9">
          <EditProductForm productId={params.productId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
