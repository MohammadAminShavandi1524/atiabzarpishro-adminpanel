"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

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
      <div className="mb-2 flex items-center justify-between">
        <label className="text-foreground text-sm font-medium">
          {t("form.video.label")}
        </label>

        {error && <span className="text-destructive text-xs">{error}</span>}
      </div>

      {!value ? (
        /* Empty State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center border border-dashed transition-colors duration-300 ${
            isDragging
              ? "border-custom-primary bg-custom-primary/5"
              : "border-border-secondary hover:border-custom-primary/60"
          }`}
        >
          <div className="border-border-secondary flex size-12 items-center justify-center border">
            <Upload className="text-custom-primary size-5" strokeWidth={1.6} />
          </div>

          <span className="text-foreground mt-4 text-sm font-medium">
            {t("form.video.select")}
          </span>

          <span className="text-muted-foreground mt-2 text-xs">
            {t("form.video.hint")}
          </span>
        </div>
      ) : (
        /* Selected Video */
        <div className="border-border-secondary overflow-hidden border">
          {/* File */}
          <div className="flex items-center justify-between p-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="border-border-secondary flex size-12 shrink-0 items-center justify-center border">
                <FileVideo
                  className="text-custom-primary size-5"
                  strokeWidth={1.6}
                />
              </div>

              <div className="min-w-0">
                <p
                  dir="ltr"
                  lang="en"
                  className="text-foreground max-w-[500px] truncate text-sm font-medium"
                >
                  {value.name}
                </p>

                <div
                  dir="ltr"
                  lang="en"
                  className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs"
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
                className="text-muted-foreground hover:text-destructive flex size-9 cursor-pointer items-center justify-center transition-colors"
                aria-label={t("form.video.remove")}
              >
                <X className="size-4" strokeWidth={1.7} />
              </button>
            )}
          </div>

          {/* Ready */}
          {!isUploading && !uploadCompleted && (
            <div className="border-border-secondary flex items-center gap-3 border-t px-5 py-4">
              <div className="border-custom-primary/25 bg-custom-primary/5 flex size-7 items-center justify-center border">
                <Clapperboard
                  className="text-custom-primary size-3.5"
                  strokeWidth={1.8}
                />
              </div>

              <span className="text-muted-foreground text-xs">
                {t("form.video.ready")}
              </span>
            </div>
          )}

          {/* Uploading */}
          {isUploading && !uploadCompleted && (
            <div className="border-border-secondary border-t px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isFinalizing ? (
                    <LoaderCircle
                      className="text-custom-primary size-3.5 animate-spin"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <div className="bg-custom-primary size-1.5 animate-pulse rounded-full" />
                  )}

                  <span className="text-muted-foreground text-xs">
                    {isFinalizing
                      ? t("form.video.finalizing")
                      : t("form.video.uploading")}
                  </span>
                </div>

                <span
                  dir="ltr"
                  lang="en"
                  className="text-foreground text-xs font-semibold tabular-nums"
                >
                  {progress}%
                </span>
              </div>

              <div className="bg-border-secondary relative h-1.5 w-full overflow-hidden">
                <div
                  className="bg-custom-primary absolute inset-y-0 start-0 transition-[width] duration-200 ease-out"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="text-muted-foreground mt-2 text-[11px]">
                {isFinalizing
                  ? t("form.video.finalizingDescription")
                  : t("form.video.doNotClose")}
              </div>
            </div>
          )}

          {/* Completed */}
          {uploadCompleted && (
            <div className="border-border-secondary border-t px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="border-custom-primary/30 bg-custom-primary/10 flex size-8 items-center justify-center border">
                    <Check
                      className="text-custom-primary size-4"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <p className="text-foreground text-xs font-medium">
                      {t("form.video.completed")}
                    </p>

                    <p className="text-muted-foreground mt-1 text-[11px]">
                      {t("form.video.completedDescription")}
                    </p>
                  </div>
                </div>

                <span
                  dir="ltr"
                  lang="en"
                  className="text-custom-primary text-xs font-semibold"
                >
                  100%
                </span>
              </div>

              <div className="bg-border-secondary mt-4 h-1.5 w-full overflow-hidden">
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
