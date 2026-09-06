"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Search, Video } from "lucide-react";

import { useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import VideoRow from "./VideoRow";

import { getVideos, type VideoItem } from "./videos.api";

import { useVideosTableAnimation } from "./useVideosTableAnimation";

import {
  VIDEOS_TABLE_GRID,
  VIDEOS_TABLE_INNER_PADDING,
  VIDEOS_TABLE_OUTER_PADDING,
} from "./videosTableLayout";

const VideosTable = () => {
  const t = useTranslations("Videos");

  const tableRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useVideosTableAnimation({
    tableRef,
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();

        setVideos(data);
      } catch (error) {
        console.error("GET VIDEOS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return videos;
    }

    return videos.filter((video) => {
      return (
        video.name_en.toLowerCase().includes(normalizedSearch) ||
        video.name_fa.toLowerCase().includes(normalizedSearch) ||
        video.description_en.toLowerCase().includes(normalizedSearch) ||
        video.description_fa.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [videos, search]);

  return (
    <div
      ref={tableRef}
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <section className="videos-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden border">
        {/* Toolbar */}
        <div className="videos-toolbar border-border 3xl:gap-5 3xl:p-5 flex shrink-0 items-center justify-between gap-5 border-b p-5 xl:gap-4 xl:p-4 2xl:p-4.5">
          {/* Search */}
          <div className="3xl:max-w-[520px] relative w-full max-w-[520px] xl:max-w-[380px] 2xl:max-w-[440px]">
            <Search
              size={19}
              strokeWidth={1.8}
              className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              className="border-border-secondary bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-12 w-full border ps-11 pe-4 text-[15px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:ps-10 xl:pe-3.5 xl:text-[14px] 2xl:h-[46px]"
            />
          </div>

          {/* Count */}
          <div className="text-muted-foreground 3xl:gap-2 3xl:text-sm flex shrink-0 items-center gap-2 text-sm xl:gap-1.5 xl:text-[12px] 2xl:text-[13px]">
            <Video
              size={18}
              strokeWidth={1.7}
              className="text-custom-primary 3xl:size-[18px] xl:size-4 2xl:size-[17px]"
            />

            <span>
              {filteredVideos.length} {t("filters.results")}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div
            className={`videos-header border-border bg-card-secondary shrink-0 border-b ${VIDEOS_TABLE_OUTER_PADDING}`}
          >
            <div
              className={`${VIDEOS_TABLE_GRID} ${VIDEOS_TABLE_INNER_PADDING} text-muted-foreground 3xl:h-13 3xl:text-sm h-13 items-center text-sm font-medium xl:h-11 xl:text-[12px] 2xl:h-12 2xl:text-[13px]`}
            >
              <div>{t("table.id")}</div>

              <div>{t("table.nameEn")}</div>

              <div>{t("table.nameFa")}</div>

              <div>{t("table.descriptionEn")}</div>

              <div>{t("table.descriptionFa")}</div>

              <div className="text-center">{t("table.actions")}</div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="3xl:gap-3 flex items-center gap-3 xl:gap-2.5">
                <span className="border-custom-primary 3xl:size-5 size-5 animate-spin rounded-full border-2 border-t-transparent xl:size-[18px]" />

                <span className="text-muted-foreground 3xl:text-sm text-sm xl:text-[13px]">
                  {t("loading")}
                </span>
              </div>
            </div>
          ) : filteredVideos.length > 0 ? (
            <ScrollArea className="min-h-0 flex-1" scrollBarClassName="me-1.75">
              <div
                className={`3xl:py-4 space-y-2.5 py-4 xl:space-y-2 xl:py-3 2xl:space-y-2.5 2xl:py-3.5 ${VIDEOS_TABLE_OUTER_PADDING}`}
              >
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
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
              <Search
                size={24}
                strokeWidth={1.7}
                className="text-muted-foreground 3xl:size-6 xl:size-[21px]"
              />

              <h3 className="text-foreground 3xl:mt-4 3xl:text-base mt-4 text-base font-semibold xl:mt-3 xl:text-[14px]">
                {t("empty.title")}
              </h3>

              <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 mt-1.5 max-w-sm text-sm leading-6 xl:text-[13px] xl:leading-5">
                {t("empty.description")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VideosTable;
