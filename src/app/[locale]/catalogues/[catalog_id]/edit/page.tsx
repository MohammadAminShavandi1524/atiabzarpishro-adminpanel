"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditCatalogueForm from "@/components/editCatalogue/forms/EditCatalogueForm";

const Page = () => {
  const t = useTranslations("editCatalogue");

  const params = useParams<{
    catalog_id: string;
  }>();

  return (
    <div className="flex flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex flex-1 flex-col px-10 pb-10">
        <div className="mt-9">
          <EditCatalogueForm catalogueId={params.catalog_id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
