"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Search } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type Brand, getBrands } from "./brands.api";

import BrandRow from "./BrandRow";

export default function BrandsPage() {
  const t = useTranslations("Brands");

  const locale = useLocale();

  const [brands, setBrands] = useState<Brand[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();

      setBrands(data);
    } catch (error) {
      console.error("GET BRANDS ERROR:", error);
    }
  };

  useEffect(() => {
    const loadBrands = async () => {
      try {
        await fetchBrands();
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return brands
      .filter((brand) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          brand.name_en.toLowerCase().includes(normalizedSearch) ||
          brand.name_fa.toLowerCase().includes(normalizedSearch) ||
          brand.description_en.toLowerCase().includes(normalizedSearch) ||
          brand.description_fa.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => a.index - b.index);
  }, [brands, search]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <section className="border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden border">
          {/* Toolbar */}
          <div className="border-border flex shrink-0 items-center justify-between gap-5 border-b p-5">
            <div className="relative w-full max-w-[520px]">
              <Search
                size={19}
                strokeWidth={1.8}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                dir={locale === "fa" ? "rtl" : "ltr"}
                placeholder={t("filters.searchPlaceholder")}
                className="border-border-secondary bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 h-12 w-full border pr-4 pl-11 text-[15px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Header */}
            <div className="border-border bg-card-secondary shrink-0 border-b ps-9 pe-11">
              <div className="text-muted-foreground grid h-13 grid-cols-[70px_1fr_110px_1.55fr_1.55fr_250px] items-center gap-5 text-sm font-semibold">
                <div>{t("table.index")}</div>

                <div>{t("table.name")}</div>

                <div>{t("table.image")}</div>

                <div>{t("table.descriptionEn")}</div>

                <div>{t("table.descriptionFa")}</div>

                <div className="text-center">{t("table.actions")}</div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center gap-3">
                  <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

                  <span className="text-muted-foreground text-sm">
                    {t("loading")}
                  </span>
                </div>
              </div>
            ) : filteredBrands.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="space-y-2.5 p-4 pe-6">
                  {filteredBrands.map((brand) => (
                    <BrandRow
                      key={brand.id}
                      brand={brand}
                      setBrands={setBrands}
                      refreshBrands={fetchBrands}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <Search
                  size={24}
                  strokeWidth={1.7}
                  className="text-muted-foreground"
                />

                <h3 className="text-foreground mt-4 text-base font-semibold">
                  {t("empty.title")}
                </h3>

                <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-6">
                  {t("empty.description")}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
