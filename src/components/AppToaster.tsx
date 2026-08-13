"use client";

import { Toaster } from "sonner";
import { useLocale } from "next-intl";

export default function AppToaster() {
  const locale = useLocale();

  return (
    <Toaster
      position={locale === "fa" ? "top-right" : "top-left"}
      closeButton
      expand
      toastOptions={{
        classNames: {
          toast:
            "!bg-background !text-foreground !border !border-border !shadow-xl !rounded-xl",

          title: "font-semibold text-foreground",

          description: "text-muted-foreground",

          actionButton: "!bg-primary !text-primary-foreground",

          cancelButton: "!bg-secondary !text-secondary-foreground",

          closeButton:
            "!bg-background !border !border-border !text-muted-foreground hover:!text-foreground",

          success: "!border-l-4 !border-l-emerald-500",

          error: "!border-l-4 !border-l-red-500",

          warning: "!border-l-4 !border-l-amber-500",

          info: "!border-l-4 !border-l-sky-500",
        },
      }}
    />
  );
}
