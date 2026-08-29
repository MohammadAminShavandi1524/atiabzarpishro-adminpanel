"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { ArrowDownUp, Search } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import { getTechNews, type TechNewsItem } from "./technews.api";

import TechNewsRow from "./TechNewsRow";

type SortType = "newest" | "oldest";

export default function TechNewsPage() {
  const t = useTranslations("TechNews");

  const locale = useLocale();

  const [items, setItems] = useState<TechNewsItem[]>([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortType>("newest");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        const data = await getTechNews();

        setItems(data);
      } catch (error) {
        console.error("GET TECH NEWS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechNews();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items
      .filter((item) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          item.name_en?.toLowerCase().includes(normalizedSearch) ||
          item.name_fa?.toLowerCase().includes(normalizedSearch) ||
          item.description_en?.toLowerCase().includes(normalizedSearch) ||
          item.description_fa?.toLowerCase().includes(normalizedSearch) ||
          item.url?.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        const firstDate = new Date(a.created).getTime();

        const secondDate = new Date(b.created).getTime();

        return sort === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [items, search, sort]);

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
          <div className="border-border flex shrink-0 items-center justify-between gap-5 border-b p-5">
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
              <div className="text-muted-foreground grid h-13 grid-cols-[60px_1fr_1fr_90px_1.45fr_1.45fr_115px_135px_300px] items-center gap-4 text-sm font-semibold">
                <div>{t("table.id")}</div>

                <div>{t("table.nameEn")}</div>

                <div>{t("table.nameFa")}</div>

                <div>{t("table.image")}</div>

                <div>{t("table.descriptionEn")}</div>

                <div>{t("table.descriptionFa")}</div>

                <div>{t("table.source")}</div>

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
            ) : filteredItems.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="space-y-2.5 p-4 pe-6">
                  {filteredItems.map((item) => (
                    <TechNewsRow
                      key={item.id}
                      item={item}
                      setItems={setItems}
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
