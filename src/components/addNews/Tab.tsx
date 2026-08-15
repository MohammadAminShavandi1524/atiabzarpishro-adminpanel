"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type NewsTab = "category" | "rootNews" | "parentNews" | "news";

interface TabProps {
  label: NewsTab;
  current: NewsTab;
  setCurrent: (value: NewsTab) => void;
  disabled?: boolean;
}

const tabIndex: Record<NewsTab, string> = {
  category: "01",
  rootNews: "02",
  parentNews: "03",
  news: "04",
};

export const Tab = ({
  label,
  current,
  setCurrent,
  disabled = false,
}: TabProps) => {
  const t = useTranslations("addNews.tabs");

  const active = label === current;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setCurrent(label)}
      className={cn(
        "group relative min-w-[150px] cursor-pointer px-5 pt-3 pb-4 text-start",
        "disabled:cursor-not-allowed",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          lang="en"
          dir="ltr"
          className={cn(
            "text-[10px] tracking-[0.1em] transition-colors duration-300",
            active ? "text-custom-primary" : "text-muted-foreground/60",
          )}
        >
          {tabIndex[label]}
        </span>

        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            active && "text-foreground",
            !active &&
              !disabled &&
              "text-muted-foreground group-hover:text-foreground",
            disabled && "text-muted-foreground/40",
          )}
        >
          {t(label)}
        </span>
      </div>

      {active && (
        <motion.span
          layoutId="news-tab-indicator"
          className="bg-custom-primary absolute inset-x-0 bottom-[-1px] h-[2px]"
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 35,
          }}
        />
      )}
    </button>
  );
};
