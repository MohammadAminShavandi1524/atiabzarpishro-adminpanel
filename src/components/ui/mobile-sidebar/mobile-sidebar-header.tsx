"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MobileSidebarHeaderProps {
  children: ReactNode;
  className?: string;
}

export function MobileSidebarHeader({
  children,
  className,
}: MobileSidebarHeaderProps) {
  return (
    <header
      className={cn(
        "border-b-border flex min-h-20 items-center border-b px-6",
        className,
      )}
    >
      {children}
    </header>
  );
}
