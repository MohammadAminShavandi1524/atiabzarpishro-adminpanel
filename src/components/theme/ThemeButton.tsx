"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative flex size-13 cursor-pointer items-center justify-center",
        "border-border border",
        "bg-tertiary/70",
        "text-muted-foreground",
        "shadow-[0_2px_10px_rgba(9,6,5,0.04)]",
        "backdrop-blur-sm",
        "transition-[color,background-color,border-color,box-shadow,transform] duration-300",
        "hover:border-accent/40",
        "hover:bg-secondary/70",
        "hover:text-accent",
        "hover:shadow-[0_4px_18px_rgba(244,154,52,0.10)]",
        "active:scale-[0.97]",
        "dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)]",
        "dark:hover:bg-secondary",
        "dark:hover:shadow-[0_4px_20px_rgba(244,154,52,0.08)]",
      )}
    >
      <span className="relative flex items-center justify-center">
        {isDark ? (
          <Sun
            strokeWidth={1.7}
            className="size-6 transition-[color,stroke-width] duration-300"
          />
        ) : (
          <Moon
            strokeWidth={1.7}
            className="size-6 transition-[color,stroke-width] duration-300"
          />
        )}
      </span>

      <span
        className={cn(
          "bg-accent pointer-events-none absolute bottom-0 left-1/2",
          "h-px w-0 -translate-x-1/2",
          "transition-all duration-300",
          "group-hover:w-1/2",
        )}
      />
    </button>
  );
}
