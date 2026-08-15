"use client";

import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import Toolbar from "./Toolbar";
import RootNewsRow from "./RootNewsRow";

import type { ParentNews, RootNews } from "./types";

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
    <section className="border-border-secondary bg-secondary-bg flex h-full flex-col overflow-hidden border">
      <Toolbar
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      <div className="border-border-secondary mx-7 mt-6 mb-7 flex min-h-0 flex-1 flex-col overflow-hidden border">
        {/* Header */}
        <div className="bg-tertiary border-border-secondary border-b px-11">
          <div className="text-muted-foreground grid h-14 grid-cols-[80px_1fr_300px] items-center text-xs font-medium tracking-[0.04em]">
            <div>{t("newsTable.table.id")}</div>

            <div>{t("newsTable.table.title")}</div>

            <div>{t("newsTable.table.actions")}</div>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 px-6 py-4 pe-2">
          <ScrollArea dir={locale === "en" ? "ltr" : "rtl"} className="h-full">
            <AnimatePresence mode="wait">
              {!loading && filteredNews.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[400px] flex-col items-center justify-center gap-3"
                >
                  <div className="border-border-secondary bg-tertiary flex size-14 items-center justify-center border">
                    <SearchX
                      className="text-muted-foreground size-6"
                      strokeWidth={1.6}
                    />
                  </div>

                  <h3 className="text-foreground text-base font-semibold">
                    {t("newsTable.empty.title")}
                  </h3>

                  <p className="text-muted-foreground text-sm">
                    {t("newsTable.empty.description")}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3 pe-4">
                  {filteredNews.map((item) => (
                    <RootNewsRow
                      key={item.id}
                      news={item}
                      parents={parentNews.filter(
                        (parent) => parent.root_blog === item.id,
                      )}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default NewsHierarchy;
