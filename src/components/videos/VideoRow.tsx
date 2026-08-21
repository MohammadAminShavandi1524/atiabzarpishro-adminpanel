"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import { useRouter } from "next/navigation";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  CustomButton,
  CustomHoldButton,
} from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import {
  englishToPersianNumber,
} from "@/lib/utils";

import type { VideoItem } from "./videos.api";

import { deleteVideo } from "./delete-video.api";

interface VideoRowProps {
  video: VideoItem;

  setVideos: Dispatch<
    SetStateAction<VideoItem[]>
  >;
}

const VideoRow = ({
  video,
  setVideos,
}: VideoRowProps) => {
  const t = useTranslations("Videos");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const handleView = () => {
    window.open(
      video.video,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDelete = async () => {
    try {
      await deleteVideo(video.id);

      setVideos((prev) =>
        prev.filter(
          (item) =>
            item.id !== video.id,
        ),
      );

      toast.success(
        t("toast.delete.success"),
      );
    } catch (error) {
      console.error(
        "DELETE VIDEO ERROR:",
        error,
      );

      toast.error(
        t("toast.delete.error"),
      );
    }
  };

  return (
    <article className="group/video border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300">
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/video:scale-y-100" />

      <div className="grid min-h-[92px] grid-cols-[70px_1.05fr_1.05fr_1.55fr_1.55fr_300px] items-center gap-4 px-5 py-3">
        {/* ID */}
        <div className="text-muted-foreground text-sm">
          {locale === "fa"
            ? `${englishToPersianNumber(
                String(video.id),
              )}#`
            : `#${video.id}`}
        </div>

        {/* English Title */}
        <div className="min-w-0">
          <p className="text-foreground truncate text-[15px] font-medium">
            {video.name_en}
          </p>
        </div>

        {/* Persian Title */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground truncate text-[15px] font-medium"
          >
            {video.name_fa}
          </p>
        </div>

        {/* English Description */}
        <div className="min-w-0">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
            {video.description_en}
          </p>
        </div>

        {/* Persian Description */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-muted-foreground line-clamp-2 text-sm leading-6"
          >
            {video.description_fa}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* View */}
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="sm"
            onClick={handleView}
            leftSection={
              <Eye
                size={16}
                strokeWidth={1.8}
              />
            }
            className="h-9 px-3 text-sm"
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
              router.push(
                `/${locale}/video-clips/edit/${video.id}`,
              );
            }}
            leftSection={
              <Pencil
                size={16}
                strokeWidth={1.8}
              />
            }
            className="h-9 px-3 text-sm"
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
            leftSection={
              <Trash2
                size={16}
                strokeWidth={1.8}
              />
            }
            className="h-9 px-3 text-sm"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
};

export default VideoRow;