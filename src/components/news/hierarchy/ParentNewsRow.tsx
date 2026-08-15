"use client";

import { useState } from "react";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Tag,
  Trash,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";
import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";
import { useCustomToast } from "@/components/ui/custom-toast";

import ChildNewsRow from "./ChildNewsRow";

import type { ChildNews, ParentNews } from "./types";

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
    <motion.div>
      {/* Parent */}
      <div className="group border-border-secondary bg-secondary-bg hover:border-custom-primary/25 hover:bg-foreground/[0.02] relative border px-5 py-4 transition-[border-color,background-color] duration-200">
        <div className="flex items-center justify-between gap-5">
          {/* Content */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="border-border-secondary flex size-10 shrink-0 items-center justify-center border">
              <FileText
                className="text-custom-primary size-4.5"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-foreground font-semibold",
                    news.lang === "fa" && "font-IRANYekanX",
                  )}
                >
                  {news.title}
                </p>

                {news.published ? (
                  <span className="flex items-center gap-1 border border-green-500/20 bg-green-500/[0.07] px-2 py-1 text-xs text-green-600">
                    <Eye className="size-3" />

                    {t("hierarchy.published")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 border border-orange-500/20 bg-orange-500/[0.07] px-2 py-1 text-xs text-orange-600">
                    <EyeOff className="size-3" />

                    {t("hierarchy.draft")}
                  </span>
                )}
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1">
                  <Globe className="size-3" />

                  {news.lang.toUpperCase()}
                </span>

                <span>
                  {t("hierarchy.category")}: {news.category.name}
                </span>

                <span>
                  {t("hierarchy.id")}: #{news.id}
                </span>
              </div>

              {news.tags?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="text-muted-foreground size-3" />

                  <div className="flex flex-wrap gap-1">
                    {news.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "border-border-secondary bg-tertiary border px-2 py-1 text-xs",
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
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/${locale}/news/parent/edit/${news.id}`}
              className={cn(
                customButtonVariants({
                  intent: "info",
                  variant: "soft",
                }),
              )}
            >
              <Edit className="size-4" />

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
                )}
              >
                <Download className="size-4" />

                <span>{t("actions.downloadImage")}</span>
              </a>
            )}

            <CustomButton
              onClick={handlePublish}
              intent="success"
              variant="soft"
            >
              {news.published ? t("actions.unpublish") : t("actions.publish")}
            </CustomButton>

            <CustomHoldButton
              intent="destructive"
              variant="soft"
              duration={1200}
              onComplete={handleDelete}
              leftSection={<Trash className="size-4" />}
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
                    "size-4.5 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              }
            >
              {t("actions.more")}
            </CustomButton>
          </div>
        </div>

        {/* Description */}
        {news.description && (
          <div className="text-muted-foreground border-border-secondary mt-4 border-t pt-3 text-sm">
            <p
              dir={news.lang === "fa" ? "rtl" : "ltr"}
              className={cn(
                "leading-7",
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
                <div className="border-border-secondary bg-foreground/[0.02] text-muted-foreground border p-4 text-sm">
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
