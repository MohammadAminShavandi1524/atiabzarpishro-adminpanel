"use client";

import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";

import { useTranslations } from "next-intl";

interface BrandImageUploadFieldProps {
  value?: File;

  onChange: (file?: File) => void;

  error?: string;

  progress: number;

  isUploading: boolean;

  isFinalizing: boolean;
}

export default function BrandImageUploadField({
  value,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
}: BrandImageUploadFieldProps) {
  const t = useTranslations("addBrand");

  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-medium">
        {t("form.image.label")}
      </label>

      <div className="border-border-secondary bg-background relative min-h-[150px] border p-5">
        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];

            onChange(file);

            event.target.value = "";
          }}
          className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />

        <div className="flex h-full min-h-[110px] flex-col items-center justify-center text-center">
          <ImagePlus className="text-custom-primary size-7" strokeWidth={1.5} />

          {value ? (
            <>
              <p className="text-foreground mt-3 max-w-full truncate text-sm font-medium">
                {value.name}
              </p>

              <p className="text-muted-foreground mt-1 text-xs">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-foreground mt-3 text-sm font-medium">
                {t("form.image.placeholder")}
              </p>

              <p className="text-muted-foreground mt-1 text-xs">
                JPG, PNG, WEBP
              </p>
            </>
          )}
        </div>

        {value && !isUploading && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              onChange(undefined);
            }}
            className="text-muted-foreground hover:text-destructive absolute end-3 top-3 z-20 cursor-pointer transition-colors"
          >
            <X size={17} strokeWidth={1.7} />
          </button>
        )}
      </div>

      {isUploading && (
        <div className="mt-3">
          <div className="bg-border-secondary h-1 overflow-hidden">
            <div
              className="bg-custom-primary h-full transition-[width] duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
            <span>
              {isFinalizing ? t("form.finalizing") : t("form.uploading")}
            </span>

            <span>{progress}%</span>
          </div>
        </div>
      )}

      <div className="mt-2 min-h-5">
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}
