"use client";

import { useState } from "react";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

import { ChevronDown, FolderTree } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import { useCustomToast } from "@/components/ui/custom-toast";

import ParentNewsRow from "./ParentNewsRow";

import type { ParentNews, RootNews } from "./types";

import {
  NEWS_HIERARCHY_ACTION_BUTTON,
  NEWS_HIERARCHY_GRID,
  NEWS_HIERARCHY_ROW_PADDING,
} from "./newsHierarchyLayout";

interface Props {
  news: RootNews;

  parents: ParentNews[];
}

const RootNewsRow = ({ news, parents }: Props) => {
  const locale = useLocale();

  const t = useTranslations("news");

  const toast = useCustomToast();

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/root/delete/${news.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(t("toast.rootNewsDeleteSuccess"));

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch {
      toast.error(t("toast.rootNewsDeleteError"));
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="min-w-0 last:mb-0"
    >
      {/* Root */}
      <div
        className={cn(
          "group border-border-secondary bg-secondary-bg hover:border-custom-primary/25 hover:bg-foreground/[0.02] 3xl:py-4 relative min-w-0 items-center border py-4 transition-[border-color,background-color] duration-200 xl:py-3 2xl:py-3.5",
          NEWS_HIERARCHY_GRID,
          NEWS_HIERARCHY_ROW_PADDING,
        )}
      >
        {/* ID */}
        <div className="text-muted-foreground 3xl:text-sm font-mono text-sm xl:text-xs 2xl:text-[13px]">
          #{news.id}
        </div>

        {/* Title */}
        <div className="3xl:gap-4 flex min-w-0 items-center gap-4 xl:gap-2.5 2xl:gap-3">
          <div className="border-border-secondary 3xl:size-10 flex size-10 shrink-0 items-center justify-center border xl:size-8 2xl:size-9">
            <FolderTree
              className="text-custom-primary 3xl:size-4.5 size-4.5 xl:size-4"
              strokeWidth={1.6}
            />
          </div>

          <p className="text-foreground 3xl:text-sm min-w-0 truncate text-sm font-semibold xl:text-[13px]">
            {news.title}
          </p>
        </div>

        {/* Actions */}
        <div className="3xl:gap-2 flex min-w-0 items-center gap-2 xl:gap-1.5">
          <Link
            href={`/${locale}/news/root/edit/${news.id}`}
            className={cn(
              customButtonVariants({
                intent: "info",
                variant: "soft",
              }),
              NEWS_HIERARCHY_ACTION_BUTTON,
            )}
          >
            {t("actions.edit")}
          </Link>

          <CustomHoldButton
            intent="destructive"
            variant="soft"
            duration={1200}
            onComplete={handleDelete}
            className={NEWS_HIERARCHY_ACTION_BUTTON}
          >
            {t("actions.delete")}
          </CustomHoldButton>

          {parents.length > 0 && (
            <CustomButton
              intent="info"
              variant="soft"
              onClick={() => setIsOpen((prev) => !prev)}
              rightSection={
                <ChevronDown
                  className={cn(
                    "3xl:size-4.5 size-4.5 transition-transform duration-200 xl:size-4",
                    isOpen && "rotate-180",
                  )}
                />
              }
              className={NEWS_HIERARCHY_ACTION_BUTTON}
            >
              {t("actions.more")}
            </CustomButton>
          )}
        </div>

        <span className="bg-custom-primary absolute inset-y-3 start-0 w-[2px] scale-y-0 transition-transform duration-200 group-hover:scale-y-100" />
      </div>

      {/* Parents */}
      <AnimatePresence initial={false}>
        {isOpen && parents.length > 0 && (
          <motion.div
            key="parents"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              },

              opacity: {
                duration: 0.2,
              },
            }}
            className="min-w-0 overflow-hidden"
          >
            <motion.div
              initial={{
                y: -8,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -8,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="3xl:ms-6 3xl:mt-3 3xl:space-y-3 relative ms-6 mt-3 min-w-0 space-y-3 xl:ms-4 xl:mt-2 xl:space-y-2 2xl:ms-5 2xl:mt-2.5 2xl:space-y-2.5"
            >
              {parents.map((parent) => (
                <ParentNewsRow key={parent.id} news={parent} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RootNewsRow;
