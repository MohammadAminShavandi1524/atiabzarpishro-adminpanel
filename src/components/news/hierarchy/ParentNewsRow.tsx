"use client";

import { useState } from "react";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

import { ChevronDown, Eye, EyeOff, FileText, Globe, Tag } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import { useCustomToast } from "@/components/ui/custom-toast";

import ChildNewsRow from "./ChildNewsRow";

import type { ChildNews, ParentNews } from "./types";

import { NEWS_HIERARCHY_ACTION_BUTTON } from "./newsHierarchyLayout";

interface Props {
  news: ParentNews;

  onDelete?: (id: number) => void;
}

const ParentNewsRow = ({ news, onDelete }: Props) => {
  const locale = useLocale();

  const t = useTranslations("news");

  const toast = useCustomToast();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [children, setChildren] = useState<ChildNews[]>([]);

  const imagePath = news.image ? news.image.split("arvanstorage.ir/")[1] : null;

  const imageUrl = imagePath ? `/api/media/${imagePath}` : null;

  const handleToggle = async () => {
    if (!loaded) {
      try {
        setLoading(true);

        const res = await fetch(`/api/blog/child/${news.id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        setChildren(Array.isArray(data) ? data : []);

        setLoaded(true);
      } catch (error) {
        console.error(error);

        setChildren([]);
      } finally {
        setLoading(false);
      }
    }

    setOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/parent/delete/${news.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      onDelete?.(news.id);

      toast.success(t("toast.parentNewsDeleteSuccess"));

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch {
      toast.error(t("toast.parentNewsDeleteError"));
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/blog/publish/${news.id}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        news.published
          ? t("toast.newsUnpublishedSuccess")
          : t("toast.newsPublishedSuccess"),
      );

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch {
      toast.error(t("toast.newsPublishError"));
    }
  };

  return (
    <motion.div className="min-w-0">
      {/* Parent */}
      <div className="group border-border-secondary bg-secondary-bg hover:border-custom-primary/25 hover:bg-foreground/[0.02] 3xl:px-5 3xl:py-4 relative min-w-0 border px-5 py-4 transition-[border-color,background-color] duration-200 xl:px-3 xl:py-3 2xl:px-4 2xl:py-3.5">
        <div className="3xl:gap-5 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 xl:gap-3 2xl:gap-4">
          {/* Content */}
          <div className="3xl:gap-4 flex min-w-0 items-center gap-4 xl:gap-2.5 2xl:gap-3">
            <div className="border-border-secondary 3xl:size-10 flex size-10 shrink-0 items-center justify-center border xl:size-8 2xl:size-9">
              <FileText
                className="text-custom-primary 3xl:size-4.5 size-4.5 xl:size-4"
                strokeWidth={1.6}
              />
            </div>

            <div className="3xl:space-y-2 min-w-0 space-y-2 xl:space-y-1.5">
              <div className="3xl:gap-2 flex min-w-0 flex-wrap items-center gap-2 xl:gap-1.5">
                <p
                  className={cn(
                    "text-foreground 3xl:text-base min-w-0 truncate font-semibold xl:text-[13px]",
                    news.lang === "fa" && "font-IRANYekanX",
                  )}
                >
                  {news.title}
                </p>

                {news.published ? (
                  <span className="3xl:px-2 3xl:py-1 3xl:text-xs flex shrink-0 items-center gap-1 border border-green-500/20 bg-green-500/[0.07] px-2 py-1 text-xs text-green-600 xl:px-1.5 xl:py-0.5 xl:text-[10px] 2xl:text-[11px]">
                    <Eye className="3xl:size-3 size-3 xl:size-2.5" />

                    {t("hierarchy.published")}
                  </span>
                ) : (
                  <span className="3xl:px-2 3xl:py-1 3xl:text-xs flex shrink-0 items-center gap-1 border border-orange-500/20 bg-orange-500/[0.07] px-2 py-1 text-xs text-orange-600 xl:px-1.5 xl:py-0.5 xl:text-[10px] 2xl:text-[11px]">
                    <EyeOff className="3xl:size-3 size-3 xl:size-2.5" />

                    {t("hierarchy.draft")}
                  </span>
                )}
              </div>

              <div className="text-muted-foreground 3xl:gap-x-4 3xl:text-xs flex flex-wrap items-center gap-x-4 gap-y-1 text-xs xl:gap-x-2.5 xl:text-[10px] 2xl:gap-x-3 2xl:text-[11px]">
                <span className="flex items-center gap-1">
                  <Globe className="3xl:size-3 size-3 xl:size-2.5" />

                  {news.lang.toUpperCase()}
                </span>

                <span className="truncate">
                  {t("hierarchy.category")}: {news.category.name}
                </span>

                <span>
                  {t("hierarchy.id")}: #{news.id}
                </span>
              </div>

              {news.tags?.length > 0 && (
                <div className="3xl:gap-2 flex min-w-0 items-center gap-2 xl:gap-1.5">
                  <Tag className="text-muted-foreground 3xl:size-3 size-3 shrink-0 xl:size-2.5" />

                  <div className="flex min-w-0 flex-wrap gap-1">
                    {news.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "border-border-secondary bg-tertiary 3xl:max-w-[180px] 3xl:px-2 3xl:py-1 3xl:text-xs max-w-[180px] truncate border px-2 py-1 text-xs xl:max-w-[120px] xl:px-1.5 xl:py-0.5 xl:text-[10px] 2xl:max-w-[150px] 2xl:text-[11px]",
                          news.lang === "fa" && "font-IRANYekanX",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="3xl:gap-2 flex shrink-0 items-center gap-2 xl:gap-1.5">
            <Link
              href={`/${locale}/news/parent/edit/${news.id}`}
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

            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  customButtonVariants({
                    intent: "info",
                    variant: "soft",
                  }),
                  NEWS_HIERARCHY_ACTION_BUTTON,
                )}
              >
                <span>{t("actions.downloadImage")}</span>
              </a>
            )}

            <CustomButton
              onClick={handlePublish}
              intent="success"
              variant="soft"
              className={NEWS_HIERARCHY_ACTION_BUTTON}
            >
              {news.published ? t("actions.unpublish") : t("actions.publish")}
            </CustomButton>

            <CustomHoldButton
              intent="destructive"
              variant="soft"
              duration={1200}
              onComplete={handleDelete}
              className={NEWS_HIERARCHY_ACTION_BUTTON}
            >
              {t("actions.delete")}
            </CustomHoldButton>

            <CustomButton
              intent="info"
              variant="soft"
              loading={loading}
              onClick={handleToggle}
              rightSection={
                <ChevronDown
                  className={cn(
                    "3xl:size-4.5 size-4.5 transition-transform duration-200 xl:size-4",
                    open && "rotate-180",
                  )}
                />
              }
              className={NEWS_HIERARCHY_ACTION_BUTTON}
            >
              {t("actions.more")}
            </CustomButton>
          </div>
        </div>

        {/* Description */}
        {news.description && (
          <div className="text-muted-foreground border-border-secondary 3xl:mt-4 3xl:pt-3 3xl:text-sm mt-4 min-w-0 border-t pt-3 text-sm xl:mt-3 xl:pt-2.5 xl:text-[12px] 2xl:text-[13px]">
            <p
              dir={news.lang === "fa" ? "rtl" : "ltr"}
              className={cn(
                "3xl:leading-7 min-w-0 leading-7 break-words xl:leading-5 2xl:leading-6",
                news.lang === "fa" && "font-IRANYekanX text-justify",
              )}
            >
              {news.description}
            </p>
          </div>
        )}

        <span className="bg-custom-primary absolute inset-y-3 start-0 w-[2px] scale-y-0 transition-transform duration-200 group-hover:scale-y-100" />
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="children"
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
              {children.length > 0 ? (
                children.map((child) => (
                  <ChildNewsRow
                    key={child.id}
                    parentLang={news.lang}
                    parentId={news.id}
                    news={child}
                  />
                ))
              ) : (
                <div className="border-border-secondary bg-foreground/[0.02] text-muted-foreground 3xl:p-4 3xl:text-sm border p-4 text-sm xl:p-3 xl:text-[12px] 2xl:text-[13px]">
                  {t("hierarchy.noChildNews")}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ParentNewsRow;
