import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
  active?: boolean;
}

const SidebarItem = ({
  href,
  icon: Icon,
  title,
  active = false,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative mb-1 flex h-12 items-center gap-3 border px-4",
        "text-[15px] font-medium",
        "transition-[background-color,border-color,color] duration-300",

        "xl:h-11 xl:gap-2.5 xl:px-3 xl:text-[14px]",
        "2xl:h-11.5 2xl:gap-2.5 2xl:px-3.5 2xl:text-[14px]",
        "3xl:h-12 3xl:gap-3 3xl:px-4 3xl:text-[15px]",

        active
          ? "border-border-secondary bg-card-secondary text-foreground"
          : "text-muted-foreground hover:border-border hover:bg-card-secondary/60 hover:text-foreground border-transparent",
      )}
    >
      {/* Industrial active line */}
      <span
        className={cn(
          "bg-custom-primary absolute inset-y-0 start-0 w-[3px]",
          "origin-center transition-transform duration-300",
          active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50",
        )}
      />

      {/* Icon */}
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center",
          "transition-colors duration-300",

          "xl:size-6.5",
          "3xl:size-7",

          active
            ? "text-custom-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon className="3xl:size-5 size-5 xl:size-4.5" strokeWidth={1.8} />
      </span>

      {/* Title */}
      <span className="min-w-0 truncate tracking-[0.01em]">{title}</span>

      {/* Active marker */}
      {active && (
        <span className="bg-custom-primary ms-auto size-1.5 shrink-0" />
      )}
    </Link>
  );
};

export default SidebarItem;
