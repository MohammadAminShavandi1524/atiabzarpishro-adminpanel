"use client";

import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { SearchX } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import Toolbar from "./Toolbar";

import RootNewsRow from "./RootNewsRow";

import type { ParentNews, RootNews } from "./types";

import {
  NEWS_HIERARCHY_GRID,
  NEWS_HIERARCHY_HEADER_PADDING,
} from "./newsHierarchyLayout";

const NewsHierarchy = () => {
  const t = useTranslations("news");

  const locale = useLocale();

  const [rootNews, setRootNews] = useState<RootNews[]>([]);

  const [parentNews, setParentNews] = useState<ParentNews[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rootRes, parentRes] = await Promise.all([
          fetch("/api/blog/root", {
            cache: "no-store",
          }),

          fetch("/api/blog/parent", {
            cache: "no-store",
          }),
        ]);

        const rootData = await rootRes.json();

        const parentData = await parentRes.json();

        setRootNews(rootData);

        setParentNews(parentData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNews = useMemo(() => {
    let news = [...rootNews];

    news = news.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );

    news.sort((a, b) => (sort === "oldest" ? a.id - b.id : b.id - a.id));

    return news;
  }, [rootNews, search, sort]);

  return (
    <section className="border-border-secondary bg-secondary-bg flex h-full max-h-full min-h-0 w-full flex-1 flex-col overflow-hidden border">
      <div className="shrink-0">
        <Toolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div className="border-border-secondary 3xl:mx-7 3xl:mt-6 3xl:mb-7 mx-7 mt-6 mb-7 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border xl:mx-4 xl:mt-4 xl:mb-4 2xl:mx-5 2xl:mt-5 2xl:mb-5">
        {/* Header */}
        <div
          className={`bg-tertiary border-border-secondary shrink-0 border-b ${NEWS_HIERARCHY_HEADER_PADDING}`}
        >
          <div
            className={`${NEWS_HIERARCHY_GRID} text-muted-foreground 3xl:h-14 h-14 items-center text-xs font-medium tracking-[0.04em] xl:h-11 xl:text-[11px] 2xl:h-12 2xl:text-xs`}
          >
            <div>{t("newsTable.table.id")}</div>

            <div>{t("newsTable.table.title")}</div>

            <div>{t("newsTable.table.actions")}</div>
          </div>
        </div>

        {/* Body */}
        <div className="3xl:ps-6 3xl:pe-2 3xl:py-4 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden py-4 ps-6 pe-2 xl:py-3 xl:ps-4 xl:pe-2 2xl:py-3.5 2xl:ps-5 2xl:pe-2">
          <ScrollArea
            dir={locale === "en" ? "ltr" : "rtl"}
            className="min-h-0 w-full flex-1"
            scrollBarClassName="me-0"
          >
            <AnimatePresence mode="wait">
              {!loading && filteredNews.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="3xl:gap-3 3xl:py-16 flex min-h-full flex-col items-center justify-center gap-3 py-16 xl:gap-2.5 xl:py-12"
                >
                  <div className="border-border-secondary bg-tertiary 3xl:size-14 flex size-14 items-center justify-center border xl:size-11 2xl:size-12">
                    <SearchX
                      className="text-muted-foreground 3xl:size-6 size-6 xl:size-5"
                      strokeWidth={1.6}
                    />
                  </div>

                  <h3 className="text-foreground 3xl:text-base text-base font-semibold xl:text-sm 2xl:text-[15px]">
                    {t("newsTable.empty.title")}
                  </h3>

                  <p className="text-muted-foreground 3xl:text-sm text-sm xl:text-[13px]">
                    {t("newsTable.empty.description")}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="news-list"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="3xl:space-y-3 3xl:pe-4 space-y-3 pe-4 xl:space-y-2 xl:pe-2 2xl:space-y-2.5 2xl:pe-3"
                >
                  {filteredNews.map((item) => (
                    <RootNewsRow
                      key={item.id}
                      news={item}
                      parents={parentNews.filter(
                        (parent) => parent.root_blog === item.id,
                      )}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default NewsHierarchy;
