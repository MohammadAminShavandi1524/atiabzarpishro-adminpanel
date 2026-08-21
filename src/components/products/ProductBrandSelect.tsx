"use client";

import { useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";
import { ProductBrand } from "@/components/products/products.api";

interface ProductBrandSelectProps {
  brands: ProductBrand[];
  value: string;
  onChange: (value: string) => void;
}

export default function ProductBrandSelect({
  brands,
  value,
  onChange,
}: ProductBrandSelectProps) {
  const t = useTranslations("Products");

  return (
    <CustomSelect
      //   label={t("filters.brand")}
      label=""
      placeholder={t("filters.allBrands")}
      value={value}
      onChange={onChange}
      options={[
        {
          label: t("filters.allBrands"),
          value: "all",
        },

        ...brands.map((brand) => ({
          label: brand.name_en,
          value: String(brand.id),
        })),
      ]}
    />
  );
}
