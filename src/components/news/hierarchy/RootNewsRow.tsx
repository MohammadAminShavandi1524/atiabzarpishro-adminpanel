"use client";

import { useState } from "react";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Edit, FolderTree, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";
import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";
import { useCustomToast } from "@/components/ui/custom-toast";

import ParentNewsRow from "./ParentNewsRow";

import type { ParentNews, RootNews } from "./types";

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
      className="last:mb-0"
    >
      {/* Root */}
      <div className="group border-border-secondary bg-secondary-bg hover:border-custom-primary/25 hover:bg-foreground/[0.02] relative grid min-h-[72px] grid-cols-[80px_1fr_300px] items-center border px-5 py-4 transition-[border-color,background-color] duration-200">
        {/* ID */}
        <div className="text-muted-foreground font-mono text-sm">
          #{news.id}
        </div>

        {/* Title */}
        <div className="flex min-w-0 items-center gap-4">
          <div className="border-border-secondary flex size-10 shrink-0 items-center justify-center border">
            <FolderTree
              className="text-custom-primary size-4.5"
              strokeWidth={1.6}
            />
          </div>

          <p className="text-foreground truncate text-sm font-semibold">
            {news.title}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/news/root/edit/${news.id}`}
            className={cn(
              customButtonVariants({
                intent: "info",
                variant: "soft",
              }),
              "gap-2",
            )}
          >
            <Edit className="size-4" />
            {t("actions.edit")}
          </Link>

          <CustomHoldButton
            intent="destructive"
            variant="soft"
            duration={1200}
            onComplete={handleDelete}
            leftSection={<Trash className="size-4" />}
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
                    "size-4.5 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              }
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
            className="overflow-hidden"
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
              className="relative ms-6 mt-3 space-y-3"
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
