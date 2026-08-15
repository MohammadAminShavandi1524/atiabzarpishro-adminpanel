"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";


export type NewsTabs =
  | "categories"
  | "news";

interface TabProps {
  label: NewsTabs;
  current: NewsTabs;
  setCurrent: (value: NewsTabs) => void;
}

export const Tab = ({ label, current, setCurrent }: TabProps) => {
  const t = useTranslations("news.tabs");

  const active = label === current;

  return (
    <button
      type="button"
      onClick={() => setCurrent(label)}
      className="group relative cursor-pointer px-6 py-3.5"
    >
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-300",
          active
            ? "text-foreground"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {t(label)}
      </span>

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
