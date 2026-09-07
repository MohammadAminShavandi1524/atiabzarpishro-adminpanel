"use client";

import { ImagePlus, X } from "lucide-react";

import { useTranslations } from "next-intl";

interface CatalogeImageUploadFieldProps {
  value?: File;
  onChange: (file?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  isFinalizing: boolean;
}

export default function CatalogeImageUploadField({
  value,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
}: CatalogeImageUploadFieldProps) {
  const t = useTranslations("addCatalogue");

  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-medium xl:text-[13px] 2xl:text-sm">
        {t("form.image.label")}
      </label>

      <div className="border-border-secondary bg-background 3xl:min-h-[150px] 3xl:p-5 relative min-h-[150px] border p-5 xl:min-h-[130px] xl:p-4 2xl:min-h-[140px] 2xl:p-4.5">
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

        <div className="3xl:min-h-[110px] flex h-full min-h-[110px] flex-col items-center justify-center text-center xl:min-h-[96px] 2xl:min-h-[102px]">
          <ImagePlus
            className="text-custom-primary 3xl:size-7 size-7 xl:size-6"
            strokeWidth={1.5}
          />

          {value ? (
            <>
              <p className="text-foreground 3xl:mt-3 3xl:text-sm mt-3 max-w-full truncate text-sm font-medium xl:mt-2.5 xl:text-[13px]">
                {value.name}
              </p>

              <p className="text-muted-foreground 3xl:text-xs mt-1 text-xs xl:text-[11px]">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-foreground 3xl:mt-3 3xl:text-sm mt-3 text-sm font-medium xl:mt-2.5 xl:text-[13px]">
                {t("form.image.placeholder")}
              </p>

              <p className="text-muted-foreground 3xl:text-xs mt-1 text-xs xl:text-[11px]">
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
            className="text-muted-foreground hover:text-destructive 3xl:end-3 3xl:top-3 absolute end-3 top-3 z-20 cursor-pointer transition-colors xl:end-2.5 xl:top-2.5"
          >
            <X
              className="3xl:size-[17px] size-[17px] xl:size-4"
              strokeWidth={1.7}
            />
          </button>
        )}
      </div>

      {isUploading && (
        <div className="3xl:mt-3 mt-3 xl:mt-2.5">
          <div className="bg-border-secondary h-1 overflow-hidden">
            <div
              className="bg-custom-primary h-full transition-[width] duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="text-muted-foreground 3xl:text-xs mt-2 flex items-center justify-between text-xs xl:text-[11px]">
            <span>
              {isFinalizing ? t("form.finalizing") : t("form.uploading")}
            </span>

            <span>{progress}%</span>
          </div>
        </div>
      )}

      <div className="mt-2 min-h-5">
        {error && (
          <p className="text-destructive 3xl:text-xs text-xs xl:text-[11px]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
