"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { ArrowDownUp, Search } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";

import { getProducts, type Product, type ProductBrand } from "./products.api";

import ProductRow from "./ProductRow";
import ProductBrandSelect from "@/components/products/ProductBrandSelect";

type SortType = "newest" | "oldest";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortType>("newest");

  const [brandFilter, setBrandFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
          product.brand.name_en.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        const firstDate = new Date(a.created).getTime();

        const secondDate = new Date(b.created).getTime();

        return sort === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [products, search, sort, brandFilter]);

  const handleSort = () => {
    setSort((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <section className="border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden border">
          {/* Toolbar */}
          <div className="border-border flex shrink-0 items-end justify-between gap-5 border-b p-5">
            <div className="flex w-full items-end gap-4">
              {/* Search */}
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

              {/* Brand Filter */}
              <div className="w-[280px] shrink-0">
                <ProductBrandSelect
                  brands={brands}
                  value={brandFilter}
                  onChange={setBrandFilter}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="shrink-0">
              <CustomButton
                type="button"
                variant="outline"
                intent="secondary"
                size="lg"
                onClick={handleSort}
                leftSection={<ArrowDownUp size={18} strokeWidth={1.8} />}
                className="h-12 px-5 text-[15px]"
              >
                {sort === "newest"
                  ? t("filters.newestFirst")
                  : t("filters.oldestFirst")}
              </CustomButton>
            </div>
          </div>

          {/* Table */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Header */}
            <div className="border-border bg-card-secondary shrink-0 border-b ps-9 pe-11">
              <div className="text-muted-foreground grid h-13 grid-cols-[60px_1.2fr_1.2fr_1fr_135px_400px] items-center gap-5 text-sm font-semibold">
                <div>{t("table.id")}</div>

                <div>{t("table.nameEn")}</div>

                <div>{t("table.nameFa")}</div>

                <div>{t("table.brand")}</div>

                <div>{t("table.date")}</div>

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
            ) : filteredProducts.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="space-y-2.5 p-4 pe-6">
                  {filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      setProducts={setProducts}
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
