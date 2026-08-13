"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

interface MobileSidebarPanelProps {
  children: React.ReactNode;

  width: number | string;

  className?: string;
}

export function MobileSidebarPanel({
  children,
  width,
  className,
}: MobileSidebarPanelProps) {
  const locale = useLocale();

  return (
    <motion.aside
      initial={{
        x: locale === "fa" ? "100%" : "-100%",
      }}
      animate={{
        x: 0,
      }}
      exit={{
        x: locale === "fa" ? "100%" : "-100%",
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 30,
      }}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
      }}
      className={cn(
        "bg-background border-border fixed top-0 z-[9999] flex h-screen flex-col pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl",
        locale === "fa" ? "right-0 border-l" : "left-0 border-r",
        className,
      )}
    >
      {children}
    </motion.aside>
  );
}
