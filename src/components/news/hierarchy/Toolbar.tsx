"use client";

import { motion } from "framer-motion";
import { ArrowDownUp, Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface ToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  sort: "newest" | "oldest";
  setSort: (value: "newest" | "oldest") => void;
}

const Toolbar = ({ search, setSearch, sort, setSort }: ToolbarProps) => {
  const t = useTranslations("news");

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex items-center justify-between gap-5 px-7 pt-7"
    >
      {/* Search */}
      <div className="group relative max-w-xl flex-1">
        <Search
          className="text-muted-foreground group-focus-within:text-custom-primary absolute start-4 top-1/2 size-4.5 -translate-y-1/2 transition-colors duration-200"
          strokeWidth={1.7}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("newsTable.searchPlaceholder")}
          className="bg-background border-border-secondary focus:border-custom-primary text-foreground placeholder:text-muted-foreground h-12 w-full border ps-11 pe-4 text-sm transition-colors duration-200 outline-none"
        />
      </div>

      {/* Sort */}
      <div className="group relative">
        <ArrowDownUp
          className="text-muted-foreground group-focus-within:text-custom-primary pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 transition-colors"
          strokeWidth={1.7}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="bg-background border-border-secondary focus:border-custom-primary text-foreground h-12 min-w-[180px] cursor-pointer appearance-none border ps-11 pe-9 text-sm transition-colors duration-200 outline-none"
        >
          <option value="newest">{t("newsTable.newestFirst")}</option>

          <option value="oldest">{t("newsTable.oldestFirst")}</option>
        </select>
      </div>
    </motion.div>
  );
};

export default Toolbar;
