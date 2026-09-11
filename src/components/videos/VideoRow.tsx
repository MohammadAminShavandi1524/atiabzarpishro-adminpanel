"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { englishToPersianNumber } from "@/lib/utils";

import type { VideoItem } from "./videos.api";

import { deleteVideo } from "./delete-video.api";

import {
  VIDEOS_TABLE_GRID,
  VIDEOS_TABLE_INNER_PADDING,
} from "./videosTableLayout";
import { useVideoRowAnimation } from "./useVideoRowAnimation";

interface VideoRowProps {
  video: VideoItem;

  setVideos: Dispatch<SetStateAction<VideoItem[]>>;

  animationIndex?: number;
}

const VideoRow = ({ video, setVideos, animationIndex = 0 }: VideoRowProps) => {
  const t = useTranslations("Videos");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  useVideoRowAnimation({
    rowRef,
    animationIndex,
  });

  const handleView = () => {
    window.open(video.video, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    try {
      await deleteVideo(video.id);

      setVideos((prev) => prev.filter((item) => item.id !== video.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE VIDEO ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  return (
    <article
      ref={rowRef}
      dir={locale === "en" ? "ltr" : "rtl"}
      className="group/video border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative w-full border transition-[background-color,border-color] duration-300"
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/video:scale-y-100" />

      <div
        className={`${VIDEOS_TABLE_GRID} ${VIDEOS_TABLE_INNER_PADDING} 3xl:min-h-[92px] 3xl:py-3 min-h-[92px] items-center py-3 xl:min-h-[80px] xl:py-2.5 2xl:min-h-[86px]`}
      >
        {/* ID */}
        <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
          {locale === "fa"
            ? `${englishToPersianNumber(String(video.id))}#`
            : `#${video.id}`}
        </div>

        {/* English Title */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
            {video.name_en}
          </p>
        </div>

        {/* Persian Title */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]"
          >
            {video.name_fa}
          </p>
        </div>

        {/* English Description */}
        <div className="min-w-0">
          <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-sm leading-6 xl:text-[12px] xl:leading-5 2xl:text-[13px]">
            {video.description_en}
          </p>
        </div>

        {/* Persian Description */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-sm leading-6 xl:text-[12px] xl:leading-5 2xl:text-[13px]"
          >
            {video.description_fa}
          </p>
        </div>

        {/* Actions */}
        <div className="3xl:gap-2 flex min-w-0 items-center justify-center gap-2 xl:gap-1.5">
          {/* View */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={handleView}
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
          >
            {t("actions.view")}
          </CustomButton>

          {/* Edit */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={() => {
              router.push(`/${locale}/video-clips/edit/${video.id}`);
            }}
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
          >
            {t("actions.edit")}
          </CustomButton>

          {/* Delete */}
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            onComplete={handleDelete}
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2 xl:text-xs 2xl:h-[34px] 2xl:px-2.5 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
};

export default VideoRow;
