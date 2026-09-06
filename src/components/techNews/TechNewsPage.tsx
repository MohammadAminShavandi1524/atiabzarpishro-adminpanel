"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { ArrowDownUp, Search } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import { getTechNews, type TechNewsItem } from "./technews.api";

import TechNewsRow from "./TechNewsRow";

import { useTechNewsPageAnimation } from "./useTechNewsPageAnimation";

import {
  TECH_NEWS_TABLE_GRID,
  TECH_NEWS_TABLE_INNER_PADDING,
  TECH_NEWS_TABLE_OUTER_PADDING,
} from "./techNewsTableLayout";

type SortType = "newest" | "oldest";

export default function TechNewsPage() {
  const t = useTranslations("TechNews");

  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<TechNewsItem[]>([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortType>("newest");

  const [loading, setLoading] = useState(true);

  useTechNewsPageAnimation({
    pageRef,
  });

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
    <div ref={pageRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <section className="tech-news-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden border">
          {/* Toolbar */}
          <div className="tech-news-toolbar border-border 3xl:gap-5 3xl:p-5 flex shrink-0 items-center justify-between gap-5 border-b p-5 xl:gap-4 xl:p-4 2xl:p-4.5">
            {/* Search */}
            <div className="3xl:max-w-[520px] relative w-full max-w-[520px] xl:max-w-[380px] 2xl:max-w-[440px]">
              <Search
                size={19}
                strokeWidth={1.8}
                className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                dir={locale === "fa" ? "rtl" : "ltr"}
                placeholder={t("filters.searchPlaceholder")}
                className="border-border-secondary bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-12 w-full border ps-11 pe-4 text-[15px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:ps-10 xl:pe-3.5 xl:text-[14px] 2xl:h-[46px]"
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
                leftSection={
                  <ArrowDownUp
                    size={18}
                    strokeWidth={1.8}
                    className="3xl:size-[18px] xl:size-4 2xl:size-[17px]"
                  />
                }
                className="3xl:h-12 3xl:px-5 3xl:text-[15px] h-12 px-5 text-[15px] xl:h-11 xl:px-4 xl:text-[13px] 2xl:h-[46px] 2xl:px-4.5 2xl:text-[14px]"
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
            <div
              className={`tech-news-header border-border bg-card-secondary shrink-0 border-b ${TECH_NEWS_TABLE_OUTER_PADDING}`}
            >
              <div
                className={`${TECH_NEWS_TABLE_GRID} ${TECH_NEWS_TABLE_INNER_PADDING} text-muted-foreground 3xl:h-13 3xl:text-sm h-13 items-center text-sm font-medium xl:h-11 xl:text-[12px] 2xl:h-12 2xl:text-[13px]`}
              >
                <div>{t("table.id")}</div>

                <div>{t("table.nameEn")}</div>

                <div>{t("table.nameFa")}</div>

                <div>{t("table.image")}</div>

                <div>{t("table.source")}</div>

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
            ) : filteredItems.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div
                  className={`3xl:py-4 space-y-2.5 py-4 xl:space-y-2 xl:py-3 2xl:space-y-2.5 2xl:py-3.5 ${TECH_NEWS_TABLE_OUTER_PADDING}`}
                >
                  {filteredItems.map((item, index) => (
                    <TechNewsRow
                      key={item.id}
                      item={item}
                      setItems={setItems}
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
