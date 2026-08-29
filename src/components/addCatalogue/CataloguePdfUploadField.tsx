"use client";

import { ChangeEvent, DragEvent, useRef } from "react";

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
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-foreground text-sm font-medium">
          {t("form.pdf.label")}
        </label>

        {error && <span className="text-destructive text-xs">{error}</span>}
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
          className="border-border-secondary bg-background hover:border-custom-primary/50 flex min-h-[150px] cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-6 text-center transition-colors"
        >
          <UploadCloud
            size={24}
            strokeWidth={1.6}
            className="text-custom-primary"
          />

          <p className="text-foreground mt-3 text-sm font-medium">
            {t("form.pdf.placeholder")}
          </p>

          <span className="text-muted-foreground mt-1 text-xs">PDF</span>
        </div>
      ) : (
        <div className="border-border-secondary bg-background border p-4">
          <div className="flex items-center gap-4">
            <div className="border-border-secondary flex size-11 shrink-0 items-center justify-center border">
              <FileText
                size={20}
                strokeWidth={1.6}
                className="text-custom-primary"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {value.name}
              </p>

              <span className="text-muted-foreground mt-1 block text-xs">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove PDF"
                className="text-muted-foreground hover:text-destructive flex size-8 cursor-pointer items-center justify-center transition-colors"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            )}
          </div>

          {showProgress && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">
                  {isFinalizing ? t("form.finalizing") : t("form.uploading")}
                </span>

                <span dir="ltr" className="text-muted-foreground text-xs">
                  {progress}%
                </span>
              </div>

              <div className="bg-border-secondary h-1.5 w-full overflow-hidden">
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
