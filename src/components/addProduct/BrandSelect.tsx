"use client";

import { useEffect, useState } from "react";

import type { ControllerRenderProps, FieldError } from "react-hook-form";

import { useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";

interface Brand {
  id: number;
  name_en: string;
  name_fa: string;
}

interface BrandSelectProps {
  field: ControllerRenderProps<any, "brand_id">;

  error?: FieldError;
}

export default function BrandSelect({ field, error }: BrandSelectProps) {
  const t = useTranslations("addProduct");

  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brand/get", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const data: Brand[] = await response.json();

        const sortedData = [...data].sort((a, b) =>
          a.name_en.localeCompare(b.name_en),
        );

        setBrands(sortedData);
      } catch (error) {
        console.error("FETCH BRANDS ERROR =>", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <CustomSelect
      label={t("form.brand.label")}
      placeholder={
        loading ? t("form.brand.loading") : t("form.brand.placeholder")
      }
      value={String(field.value || "")}
      onChange={(value) => field.onChange(Number(value))}
      options={brands.map((brand) => ({
        label: `${brand.name_en}`,
        value: String(brand.id),
      }))}
      disabled={loading}
      error={error}
    />
  );
}
