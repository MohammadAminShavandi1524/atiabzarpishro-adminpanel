"use client";

import { type ChangeEvent, type DragEvent, useRef } from "react";

import { FileText, UploadCloud, X } from "lucide-react";

import { useTranslations } from "next-intl";

interface CataloguePdfUploadFieldProps {
  value?: File;

  onChange: (file?: File) => void;

  error?: string;

  progress: number;

  isUploading: boolean;

  isFinalizing: boolean;
}

const CataloguePdfUploadField = ({
  value,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
}: CataloguePdfUploadFieldProps) => {
  const t = useTranslations("addCatalogue");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) {
      return;
    }

    onChange(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showProgress = isUploading && (progress > 0 || isFinalizing);

  return (
    <div>
      <div className="3xl:gap-3 mb-2 flex items-center justify-between gap-3 xl:gap-2.5">
        <label className="text-foreground text-sm font-medium xl:text-[13px] 2xl:text-sm">
          {t("form.pdf.label")}
        </label>

        {error && (
          <span className="text-destructive 3xl:text-xs text-xs xl:text-[11px]">
            {error}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      {!value ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="border-border-secondary bg-background hover:border-custom-primary/50 3xl:min-h-[150px] 3xl:px-6 3xl:py-6 flex min-h-[150px] cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-6 text-center transition-colors xl:min-h-[130px] xl:px-5 xl:py-5 2xl:min-h-[140px]"
        >
          <UploadCloud
            size={24}
            strokeWidth={1.6}
            className="text-custom-primary 3xl:size-6 xl:size-[21px] 2xl:size-[22px]"
          />

          <p className="text-foreground 3xl:mt-3 3xl:text-sm mt-3 text-sm font-medium xl:mt-2.5 xl:text-[13px]">
            {t("form.pdf.placeholder")}
          </p>

          <span className="text-muted-foreground 3xl:text-xs mt-1 text-xs xl:text-[11px]">
            PDF
          </span>
        </div>
      ) : (
        <div className="border-border-secondary bg-background 3xl:p-4 border p-4 xl:p-3.5 2xl:p-4">
          <div className="3xl:gap-4 flex items-center gap-4 xl:gap-3 2xl:gap-3.5">
            <div className="border-border-secondary 3xl:size-11 flex size-11 shrink-0 items-center justify-center border xl:size-10">
              <FileText
                size={20}
                strokeWidth={1.6}
                className="text-custom-primary 3xl:size-5 xl:size-[18px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-foreground 3xl:text-sm truncate text-sm font-medium xl:text-[13px]">
                {value.name}
              </p>

              <span className="text-muted-foreground 3xl:text-xs mt-1 block text-xs xl:text-[11px]">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove PDF"
                className="text-muted-foreground hover:text-destructive 3xl:size-8 flex size-8 cursor-pointer items-center justify-center transition-colors xl:size-7"
              >
                <X
                  size={18}
                  strokeWidth={1.7}
                  className="3xl:size-[18px] xl:size-4"
                />
              </button>
            )}
          </div>

          {showProgress && (
            <div className="3xl:mt-4 mt-4 xl:mt-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground 3xl:text-xs text-xs xl:text-[11px]">
                  {isFinalizing ? t("form.finalizing") : t("form.uploading")}
                </span>

                <span
                  dir="ltr"
                  className="text-muted-foreground 3xl:text-xs text-xs xl:text-[11px]"
                >
                  {progress}%
                </span>
              </div>

              <div className="bg-border-secondary 3xl:h-1.5 h-1.5 w-full overflow-hidden xl:h-1">
                <div
                  className="bg-custom-primary h-full transition-[width] duration-200"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CataloguePdfUploadField;
