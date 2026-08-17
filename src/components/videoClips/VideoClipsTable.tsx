"use client";

import { useMemo, useRef, useState } from "react";

import { Search, Video } from "lucide-react";

import { useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollArea } from "@/components/ui/scroll-area";

import VideoRow from "./VideoRow";

import { videos as initialVideos, type VideoItem } from "./videos.data";

gsap.registerPlugin(useGSAP);

const VideoClipsTable = () => {
  const t = useTranslations("VideoClips");

  const tableRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);

  const [search, setSearch] = useState("");

  const filteredVideos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return videos;
    }

    return videos.filter((video) => {
      return (
        video.name_en.toLowerCase().includes(normalizedSearch) ||
        video.name_fa.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [videos, search]);

  useGSAP(
    () => {
      if (!tableRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        ".videos-panel",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
      );

      timeline.fromTo(
        ".videos-search",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".videos-table-header",
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.2",
      );
    },
    {
      scope: tableRef,
    },
  );

  return (
    <div ref={tableRef} className="flex min-h-0 flex-1 flex-col">
      <section className="videos-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden border">
        {/* Toolbar */}
        <div className="border-border flex shrink-0 items-center justify-between gap-5 border-b p-5">
          {/* Search */}
          <div className="videos-search relative w-full max-w-[520px]">
            <Search
              size={19}
              strokeWidth={1.8}
              className="text-muted-foreground pointer-events-none absolute start-4 top-1/2 -translate-y-1/2"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              className="border-border-secondary bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 h-12 w-full border ps-11 pe-4 text-[15px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2"
            />
          </div>

          {/* Count */}
          <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-sm">
            <Video
              size={18}
              strokeWidth={1.7}
              className="text-custom-primary"
            />

            <span>
              {filteredVideos.length} {t("filters.results")}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Table Header */}
          <div className="videos-table-header border-border bg-card-secondary shrink-0 border-b ps-9 pe-11">
            <div className="text-muted-foreground grid h-13 grid-cols-[70px_1.05fr_1.05fr_1.55fr_1.55fr_240px] items-center gap-4 text-sm font-semibold">
              <div>{t("table.id")}</div>

              <div>{t("table.nameEn")}</div>

              <div>{t("table.nameFa")}</div>

              <div>{t("table.descriptionEn")}</div>

              <div>{t("table.descriptionFa")}</div>

              <div className="text-center">{t("table.actions")}</div>
            </div>
          </div>

          {/* Content */}
          {filteredVideos.length > 0 ? (
            <ScrollArea className="min-h-0 flex-1" scrollBarClassName="me-1.75">
              <div className="space-y-2.5 p-4 pe-6">
                {filteredVideos.map((video, index) => (
                  <VideoRow
                    key={video.id}
                    video={video}
                    setVideos={setVideos}
                    animationIndex={index}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="border-border bg-card-secondary flex size-12 items-center justify-center border">
                <Search
                  size={21}
                  strokeWidth={1.7}
                  className="text-muted-foreground"
                />
              </div>

              <h3 className="text-foreground mt-4 text-base font-semibold">
                {t("empty.title")}
              </h3>

              <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-6">
                {t("empty.description")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VideoClipsTable;
