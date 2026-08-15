"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  Download,
  Edit,
  FileText,
  Image as ImageIcon,
  Trash,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";
import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";
import { useCustomToast } from "@/components/ui/custom-toast";

import type { ChildNews } from "./types";

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
    >
      <div className="group border-border-secondary bg-secondary-bg hover:border-custom-primary/25 hover:bg-foreground/[0.02] relative border px-5 py-4 transition-[border-color,background-color] duration-200">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6">
          {/* Content */}
          <div className="flex min-w-0 items-start gap-4">
            <div className="border-border-secondary flex size-10 shrink-0 items-center justify-center border">
              <FileText
                className="text-custom-primary size-4.5"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <p
                dir={parentLang === "fa" ? "rtl" : "ltr"}
                className={cn(
                  "min-w-0 font-semibold break-words",
                  parentLang === "fa" && "font-IRANYekanX",
                )}
              >
                {news.title}
              </p>

              <p
                dir={parentLang === "fa" ? "rtl" : "ltr"}
                className={cn(
                  "text-muted-foreground min-w-0 text-sm leading-6 break-all",
                  parentLang === "fa" && "font-IRANYekanX text-justify",
                )}
              >
                {news.description}
              </p>

              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <span>
                  {t("hierarchy.id")}: #{news.id}
                </span>

                {imageAvailable && (
                  <>
                    <span>•</span>

                    <span className="text-custom-primary flex items-center gap-1">
                      <ImageIcon className="size-3.5" />

                      {t("hierarchy.imageAttached")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/${locale}/news/child/edit/${parentId}/${news.id}`}
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

            <a
              href={news.image ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!imageAvailable}
              className={cn(
                customButtonVariants({
                  intent: "info",
                  variant: "soft",
                }),
                !imageAvailable &&
                  "pointer-events-none cursor-not-allowed opacity-50",
              )}
            >
              <Download className="size-4" />

              <span>{t("actions.downloadImage")}</span>
            </a>

            <CustomHoldButton
              intent="destructive"
              variant="soft"
              duration={1200}
              onComplete={handleDelete}
              leftSection={<Trash className="size-4" />}
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
