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
          active
            ? "text-custom-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon className="size-5" strokeWidth={1.8} />
      </span>

      {/* Title */}
      <span className="truncate tracking-[0.01em]">{title}</span>

      {/* Active marker */}
      {active && (
        <span className="bg-custom-primary ms-auto size-1.5 shrink-0" />
      )}
    </Link>
  );
};

export default SidebarItem;
