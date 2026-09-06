"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Search } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProductBrandSelect from "@/components/products/ProductBrandSelect";

import { getProducts, type Product, type ProductBrand } from "./products.api";

import ProductRow from "./ProductRow";
import { useProductsPageAnimation } from "./useProductsPageAnimation";

export default function ProductsPage() {
  const t = useTranslations("Products");

  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [brandFilter, setBrandFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  useProductsPageAnimation({
    pageRef,
  });

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("GET PRODUCTS ERROR:", error);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const brands = useMemo<ProductBrand[]>(() => {
    const map = new Map<number, ProductBrand>();

    products.forEach((product) => {
      map.set(product.brand.id, product.brand);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name_en.localeCompare(b.name_en),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (brandFilter !== "all" && String(product.brand.id) !== brandFilter) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        return (
          product.name_en.toLowerCase().includes(normalizedSearch) ||
          product.name_fa.toLowerCase().includes(normalizedSearch) ||
          product.description_en?.toLowerCase().includes(normalizedSearch) ||
          product.description_fa?.toLowerCase().includes(normalizedSearch) ||
          product.brand.name_en.toLowerCase().includes(normalizedSearch) ||
          product.brand.name_fa.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => a.index - b.index);
  }, [products, search, brandFilter]);

  return (
    <div ref={pageRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <section className="products-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden border">
          {/* Toolbar */}
          <div className="products-toolbar border-border 3xl:gap-5 3xl:p-5 relative z-30 flex shrink-0 items-end justify-between gap-5 border-b p-5 xl:gap-4 xl:p-4 2xl:p-4.5">
            <div className="3xl:gap-4 flex w-full items-end gap-4 xl:gap-3 2xl:gap-3.5">
              {/* Search */}
              <div className="3xl:max-w-[520px] relative w-full max-w-[520px] xl:max-w-[380px] 2xl:max-w-[440px]">
                <Search
                  size={19}
                  strokeWidth={1.8}
                  className="text-muted-foreground 3xl:left-4 3xl:size-[19px] pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 xl:left-3.5 xl:size-[17px]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  dir={locale === "fa" ? "rtl" : "ltr"}
                  placeholder={t("filters.searchPlaceholder")}
                  className="border-border-secondary bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:pr-4 3xl:pl-11 3xl:text-[15px] h-12 w-full border pr-4 pl-11 text-[15px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:pr-3.5 xl:pl-10 xl:text-[14px]"
                />
              </div>

              {/* Brand Filter */}
              <div className="3xl:w-[280px] relative z-40 w-[280px] shrink-0 xl:w-[210px] 2xl:w-[240px]">
                <ProductBrandSelect
                  brands={brands}
                  value={brandFilter}
                  onChange={setBrandFilter}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Header */}
            <div className="products-header border-border bg-card-secondary 3xl:ps-9 3xl:pe-11 shrink-0 border-b ps-9 pe-11 xl:ps-7 xl:pe-9 2xl:ps-8 2xl:pe-10">
              <div className="text-muted-foreground 3xl:h-13 3xl:grid-cols-[70px_1fr_1fr_100px_1fr_1.4fr_1.4fr_260px] 3xl:gap-4 3xl:text-sm grid h-13 grid-cols-[70px_1fr_1fr_100px_1fr_1.4fr_1.4fr_260px] items-center gap-4 text-sm font-medium xl:h-11 xl:grid-cols-[52px_minmax(90px,1fr)_minmax(90px,1fr)_64px_minmax(90px,0.9fr)_minmax(120px,1.25fr)_minmax(120px,1.25fr)_170px] xl:gap-3 xl:text-[12px] 2xl:h-12 2xl:grid-cols-[60px_minmax(100px,1fr)_minmax(100px,1fr)_80px_minmax(100px,0.9fr)_minmax(140px,1.3fr)_minmax(140px,1.3fr)_210px] 2xl:gap-3.5 2xl:text-[13px]">
                <div>{t("table.index")}</div>

                <div>{t("table.nameEn")}</div>

                <div>{t("table.nameFa")}</div>

                <div>{t("table.image")}</div>

                <div>{t("table.brand")}</div>

                <div>{t("table.descriptionEn")}</div>

                <div>{t("table.descriptionFa")}</div>

                <div className="text-center">{t("table.actions")}</div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div className="3xl:gap-3 flex items-center gap-3 xl:gap-2.5">
                  <span className="border-custom-primary 3xl:size-5 size-5 animate-spin rounded-full border-2 border-t-transparent xl:size-[18px]" />

                  <span className="text-muted-foreground 3xl:text-sm text-sm xl:text-[13px]">
                    {t("loading")}
                  </span>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="3xl:p-4 3xl:pe-6 space-y-2.5 p-4 pe-6 xl:space-y-2 xl:p-3 xl:pe-5 2xl:space-y-2.5 2xl:p-3.5 2xl:pe-5.5">
                  {filteredProducts.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      setProducts={setProducts}
                      refreshProducts={fetchProducts}
                      animationIndex={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                <Search
                  size={24}
                  strokeWidth={1.7}
                  className="text-muted-foreground 3xl:size-6 xl:size-[21px]"
                />

                <h3 className="text-foreground 3xl:mt-4 3xl:text-base mt-4 text-base font-semibold xl:mt-3 xl:text-[14px]">
                  {t("empty.title")}
                </h3>

                <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 mt-1.5 max-w-sm text-sm leading-6 xl:text-[13px] xl:leading-5">
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
