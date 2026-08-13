"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale, useLocale } from "next-intl";
import { ArrowLeftRight, Earth, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  defaultLocale: Locale;
};

export default function LanguageSwitcher({ defaultLocale }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  const nextLocale = defaultLocale === "fa" ? "en" : "fa";

  function handleToggle() {
    startTransition(() => {
      router.replace(
        // @ts-expect-error
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  const currentLanguage = locale === "fa" ? "FA" : "EN";
  const targetLanguage = nextLocale === "fa" ? "FA" : "EN";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={`Switch language to ${targetLanguage}`}
      className={cn(
        "group relative flex h-13 cursor-pointer items-center gap-x-1.5",
        "border",
        "border-border bg-tertiary/70",
        "ps-2.5 pe-4",
        "shadow-[0_2px_10px_rgba(9,6,5,0.04)]",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-accent/40",
        "hover:bg-secondary/70",
        "hover:shadow-[0_4px_18px_rgba(244,154,52,0.10)]",
        "active:scale-[0.97]",
        "dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)]",
        "dark:hover:bg-secondary",
        "dark:hover:shadow-[0_4px_20px_rgba(244,154,52,0.08)]",
        isPending && "pointer-events-none opacity-50",
      )}
    >
      {/* Globe */}
      <span
        className={cn(
          "relative flex items-center justify-center p-1",
          "overflow-hidden",
          "bg-background",
          "border-border border",
          "transition-all duration-300",
          "group-hover:border-accent/30",
          "group-hover:bg-secondary",
        )}
      >
        <Earth
          strokeWidth={1.6}
          className={cn(
            "size-[22px]",
            "text-muted-foreground",
            "transition-all duration-500",
            "group-hover:text-accent",
          )}
        />
      </span>

      {/* Language */}
      <span className="mt-px flex items-center gap-x-1.5">
        {/* Current */}
        <span
          className={cn(
            "text-base font-semibold tracking-wide",
            "text-foreground",
            "transition-colors duration-300",
          )}
        >
          {currentLanguage}
        </span>

        {/* Divider */}
        <span className="bg-border-secondary/60 mb-0.5 h-3.5 w-px" />

        {/* Target */}
        <span
          className={cn(
            "text-base font-medium",
            "text-muted-foreground",
            "transition-colors duration-300",
            "group-hover:text-accent",
          )}
        >
          {targetLanguage}
        </span>
      </span>

      {/* Switch Icon */}
      <span
        className={cn(
          "ms-1 flex items-center justify-center",
          "text-muted-foreground",
          "transition-all duration-300",
          "group-hover:text-accent",
          locale === "fa" && "mb-0.5",
        )}
      >
        <ArrowLeftRight
          strokeWidth={1.7}
          className={cn(
            "size-[20px]",
            "transition-all duration-500 ease-out",
            "group-hover:scale-x-110",
          )}
        />
      </span>

      {/* Accent line */}
      <span
        className={cn(
          "absolute bottom-0 left-1/2",
          "h-px w-0 -translate-x-1/2",
          "bg-accent",
          "transition-all duration-300",
          "group-hover:w-1/2",
        )}
      />
    </button>
  );
}
