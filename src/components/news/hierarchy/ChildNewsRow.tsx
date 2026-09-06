"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { FileText, Image as ImageIcon } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { ChildNews } from "./types";

import { NEWS_HIERARCHY_ACTION_BUTTON } from "./newsHierarchyLayout";

interface Props {
  news: ChildNews;

  parentLang: string;

  parentId: number;
}

const ChildNewsRow = ({ news, parentLang, parentId }: Props) => {
  const locale = useLocale();

  const t = useTranslations("news");

  const toast = useCustomToast();

  const imageAvailable = Boolean(news.image);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/child/delete/${news.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(t("toast.childNewsDeleteSuccess"));

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch {
      toast.error(t("toast.childNewsDeleteError"));
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      transition={{
        duration: 0.2,
      }}
      className="min-w-0"
    >
      <div className="group border-border-secondary bg-secondary-bg hover:border-custom-primary/25 hover:bg-foreground/[0.02] 3xl:px-5 3xl:py-4 relative min-w-0 border px-5 py-4 transition-[border-color,background-color] duration-200 xl:px-3 xl:py-3 2xl:px-4 2xl:py-3.5">
        <div className="3xl:gap-6 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-6 xl:gap-3 2xl:gap-4">
          {/* Content */}
          <div className="3xl:gap-4 flex min-w-0 items-start gap-4 xl:gap-2.5 2xl:gap-3">
            <div className="border-border-secondary 3xl:size-10 flex size-10 shrink-0 items-center justify-center border xl:size-8 2xl:size-9">
              <FileText
                className="text-custom-primary 3xl:size-4.5 size-4.5 xl:size-4"
                strokeWidth={1.6}
              />
            </div>

            <div className="3xl:space-y-2 min-w-0 flex-1 space-y-2 xl:space-y-1.5">
              <p
                dir={parentLang === "fa" ? "rtl" : "ltr"}
                className={cn(
                  "3xl:text-base min-w-0 font-semibold break-words xl:text-[13px]",
                  parentLang === "fa" && "font-IRANYekanX",
                )}
              >
                {news.title}
              </p>

              <p
                dir={parentLang === "fa" ? "rtl" : "ltr"}
                className={cn(
                  "text-muted-foreground 3xl:text-sm min-w-0 text-sm leading-6 break-words xl:text-[12px] xl:leading-5 2xl:text-[13px] 2xl:leading-6",
                  parentLang === "fa" && "font-IRANYekanX text-justify",
                )}
              >
                {news.description}
              </p>

              <div className="text-muted-foreground 3xl:gap-2 3xl:text-xs flex flex-wrap items-center gap-2 text-xs xl:gap-1.5 xl:text-[10px] 2xl:text-[11px]">
                <span>
                  {t("hierarchy.id")}: #{news.id}
                </span>

                {imageAvailable && (
                  <>
                    <span>•</span>

                    <span className="text-custom-primary flex items-center gap-1">
                      <ImageIcon className="3xl:size-3.5 size-3.5 xl:size-3" />

                      {t("hierarchy.imageAttached")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="3xl:gap-2 flex shrink-0 items-center gap-2 xl:gap-1.5">
            <Link
              href={`/${locale}/news/child/edit/${parentId}/${news.id}`}
              className={cn(
                customButtonVariants({
                  intent: "info",
                  variant: "soft",
                }),
                NEWS_HIERARCHY_ACTION_BUTTON,
              )}
            >
              <span>{t("actions.edit")}</span>
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
          </div>
        </div>

        <span className="bg-custom-primary absolute inset-y-3 start-0 w-[2px] scale-y-0 transition-transform duration-200 group-hover:scale-y-100" />
      </div>
    </motion.div>
  );
};

export default ChildNewsRow;
