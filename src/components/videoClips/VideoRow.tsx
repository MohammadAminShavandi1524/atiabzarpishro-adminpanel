"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";

import Link from "next/link";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import type { VideoItem } from "./videos.data";

gsap.registerPlugin(useGSAP);

interface VideoRowProps {
  video: VideoItem;
  setVideos: Dispatch<SetStateAction<VideoItem[]>>;
  animationIndex?: number;
}

const VideoRow = ({ video, setVideos, animationIndex = 0 }: VideoRowProps) => {
  const t = useTranslations("VideoClips");

  const locale = useLocale();

  const rowRef = useRef<HTMLElement>(null);

  const handleView = () => {
    window.open(video.video, "_blank", "noopener,noreferrer");
  };

  const handleDelete = () => {
    setVideos((prev) => prev.filter((item) => item.id !== video.id));
  };

  useGSAP(
    () => {
      if (!rowRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: Math.min(animationIndex, 8) * 0.055,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );

  return (
    <article
      ref={rowRef}
      className="group/video border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative border transition-[background-color,border-color] duration-300"
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/video:scale-y-100" />

      <div className="grid min-h-[92px] grid-cols-[70px_1.05fr_1.05fr_1.55fr_1.55fr_240px] items-center gap-4 px-5 py-3">
        {/* ID */}
        <div dir="ltr" className="text-muted-foreground font-mono text-sm">
          #{video.id}
        </div>

        {/* English Title */}
        <div className="min-w-0">
          <p
            lang="en"
            className="text-foreground truncate text-[15px] font-medium"
          >
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
          <p
            lang="en"
            className="text-muted-foreground line-clamp-2 text-sm leading-6"
          >
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
        <div className="flex items-center justify-center gap-2">
          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="md"
            onClick={handleView}
            leftSection={<Eye size={16} strokeWidth={1.8} />}
            className="h-9 px-3 text-sm"
          >
            {t("actions.view")}
          </CustomButton>

         <Link href={`/${locale}/video-clips/edit/${video.id}`}>
            <CustomButton
              type="button"
              variant="soft"
              intent="secondary"
              size="md"
              leftSection={<Pencil size={16} strokeWidth={1.8} />}
              className="h-9 px-3 text-sm"
            >
              {t("actions.edit")}
            </CustomButton>
          </Link>

          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            onComplete={handleDelete}
            leftSection={<Trash2 size={16} strokeWidth={1.8} />}
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
