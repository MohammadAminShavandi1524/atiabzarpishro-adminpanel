"use client";

import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

import {
  Check,
  Clapperboard,
  FileVideo,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import { useTranslations } from "next-intl";

type VideoUploadFieldProps = {
  value?: File;
  onChange: (file?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  isFinalizing: boolean;
  uploadCompleted: boolean;
};

const VideoUploadField = ({
  value,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
  uploadCompleted,
}: VideoUploadFieldProps) => {
  const t = useTranslations("addVideo");

  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      return;
    }

    onChange(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    handleFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  };

  const handleRemove = () => {
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return "0 MB";
    }

    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${kb.toFixed(2)} KB`;
  };

  return (
    <div>
      {/* Label */}
      <div className="3xl:gap-3 mb-2 flex items-center justify-between gap-3 xl:gap-2.5">
        <label className="text-foreground text-sm font-medium xl:text-[13px] 2xl:text-sm">
          {t("form.video.label")}
        </label>

        {error && (
          <span className="text-destructive 3xl:text-xs text-xs xl:text-[11px]">
            {error}
          </span>
        )}
      </div>

      {!value ? (
        /* Empty State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`3xl:min-h-[180px] flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center border border-dashed transition-colors duration-300 xl:min-h-[145px] 2xl:min-h-[160px] ${
            isDragging
              ? "border-custom-primary bg-custom-primary/5"
              : "border-border-secondary hover:border-custom-primary/60"
          }`}
        >
          <div className="border-border-secondary 3xl:size-12 flex size-12 items-center justify-center border xl:size-10 2xl:size-11">
            <Upload
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <span className="text-foreground 3xl:mt-4 3xl:text-sm mt-4 text-sm font-medium xl:mt-3 xl:text-[13px]">
            {t("form.video.select")}
          </span>

          <span className="text-muted-foreground 3xl:mt-2 3xl:text-xs mt-2 text-xs xl:mt-1.5 xl:text-[11px]">
            {t("form.video.hint")}
          </span>
        </div>
      ) : (
        /* Selected Video */
        <div className="border-border-secondary overflow-hidden border">
          {/* File */}
          <div className="3xl:p-5 flex items-center justify-between p-5 xl:p-4 2xl:p-4.5">
            <div className="3xl:gap-4 flex min-w-0 items-center gap-4 xl:gap-3 2xl:gap-3.5">
              <div className="border-border-secondary 3xl:size-12 flex size-12 shrink-0 items-center justify-center border xl:size-10 2xl:size-11">
                <FileVideo
                  className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
                  strokeWidth={1.6}
                />
              </div>

              <div className="min-w-0">
                <p
                  dir="ltr"
                  lang="en"
                  className="text-foreground 3xl:max-w-[500px] 3xl:text-sm max-w-[500px] truncate text-sm font-medium xl:max-w-[360px] xl:text-[13px] 2xl:max-w-[420px]"
                >
                  {value.name}
                </p>

                <div
                  dir="ltr"
                  lang="en"
                  className="text-muted-foreground 3xl:mt-1.5 3xl:gap-2 3xl:text-xs mt-1.5 flex items-center gap-2 text-xs xl:mt-1 xl:gap-1.5 xl:text-[11px]"
                >
                  <span>{formatFileSize(value.size)}</span>

                  <span>•</span>

                  <span>{value.type || "video"}</span>
                </div>
              </div>
            </div>

            {!isUploading && !uploadCompleted && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive 3xl:size-9 flex size-9 cursor-pointer items-center justify-center transition-colors xl:size-8"
                aria-label={t("form.video.remove")}
              >
                <X
                  className="3xl:size-4 size-4 xl:size-[15px]"
                  strokeWidth={1.7}
                />
              </button>
            )}
          </div>

          {/* Ready */}
          {!isUploading && !uploadCompleted && (
            <div className="border-border-secondary 3xl:gap-3 3xl:px-5 3xl:py-4 flex items-center gap-3 border-t px-5 py-4 xl:gap-2.5 xl:px-4 xl:py-3 2xl:px-4.5 2xl:py-3.5">
              <div className="border-custom-primary/25 bg-custom-primary/5 3xl:size-7 flex size-7 items-center justify-center border xl:size-6">
                <Clapperboard
                  className="text-custom-primary 3xl:size-3.5 size-3.5 xl:size-3"
                  strokeWidth={1.8}
                />
              </div>

              <span className="text-muted-foreground 3xl:text-xs text-xs xl:text-[11px]">
                {t("form.video.ready")}
              </span>
            </div>
          )}

          {/* Uploading */}
          {isUploading && !uploadCompleted && (
            <div className="border-border-secondary 3xl:px-5 3xl:py-4 border-t px-5 py-4 xl:px-4 xl:py-3 2xl:px-4.5 2xl:py-3.5">
              <div className="3xl:mb-3 mb-3 flex items-center justify-between xl:mb-2.5">
                <div className="flex items-center gap-2">
                  {isFinalizing ? (
                    <LoaderCircle
                      className="text-custom-primary 3xl:size-3.5 size-3.5 animate-spin xl:size-3"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <div className="bg-custom-primary size-1.5 animate-pulse rounded-full" />
                  )}

                  <span className="text-muted-foreground 3xl:text-xs text-xs xl:text-[11px]">
                    {isFinalizing
                      ? t("form.video.finalizing")
                      : t("form.video.uploading")}
                  </span>
                </div>

                <span
                  dir="ltr"
                  lang="en"
                  className="text-foreground 3xl:text-xs text-xs font-semibold tabular-nums xl:text-[11px]"
                >
                  {progress}%
                </span>
              </div>

              <div className="bg-border-secondary 3xl:h-1.5 relative h-1.5 w-full overflow-hidden xl:h-1">
                <div
                  className="bg-custom-primary absolute inset-y-0 start-0 transition-[width] duration-200 ease-out"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="text-muted-foreground 3xl:text-[11px] mt-2 text-[11px] xl:text-[10px]">
                {isFinalizing
                  ? t("form.video.finalizingDescription")
                  : t("form.video.doNotClose")}
              </div>
            </div>
          )}

          {/* Completed */}
          {uploadCompleted && (
            <div className="border-border-secondary 3xl:px-5 3xl:py-4 border-t px-5 py-4 xl:px-4 xl:py-3 2xl:px-4.5 2xl:py-3.5">
              <div className="flex items-center justify-between">
                <div className="3xl:gap-3 flex items-center gap-3 xl:gap-2.5">
                  <div className="border-custom-primary/30 bg-custom-primary/10 3xl:size-8 flex size-8 items-center justify-center border xl:size-7">
                    <Check
                      className="text-custom-primary 3xl:size-4 size-4 xl:size-3.5"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <p className="text-foreground 3xl:text-xs text-xs font-medium xl:text-[11px]">
                      {t("form.video.completed")}
                    </p>

                    <p className="text-muted-foreground 3xl:text-[11px] mt-1 text-[11px] xl:text-[10px]">
                      {t("form.video.completedDescription")}
                    </p>
                  </div>
                </div>

                <span
                  dir="ltr"
                  lang="en"
                  className="text-custom-primary 3xl:text-xs text-xs font-semibold xl:text-[11px]"
                >
                  100%
                </span>
              </div>

              <div className="bg-border-secondary 3xl:mt-4 3xl:h-1.5 mt-4 h-1.5 w-full overflow-hidden xl:mt-3 xl:h-1">
                <div className="bg-custom-primary h-full w-full" />
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default VideoUploadField;
