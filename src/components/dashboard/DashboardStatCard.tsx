"use client";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import { ArrowUpRight } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  count: number;
  href: string;
  icon: LucideIcon;
}

const DashboardStatCard = ({
  title,
  count,
  href,
  icon: Icon,
}: DashboardStatCardProps) => {
  return (
    <Link
      href={href}
      className="group/item border-border bg-background hover:bg-card-secondary/40 relative flex min-h-[76px] items-center gap-4 border px-5 transition-colors duration-300"
    >
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/item:scale-y-100" />

      <Icon
        size={22}
        strokeWidth={1.7}
        className="text-custom-primary shrink-0"
      />

      <span className="text-foreground min-w-0 flex-1 text-[15px] font-medium">
        {title}
      </span>

      <span className="text-foreground text-[22px] font-semibold">
        {count}
      </span>

      <ArrowUpRight
        size={18}
        strokeWidth={1.6}
        className="text-muted-foreground shrink-0 transition-colors duration-300 group-hover/item:text-custom-primary"
      />
    </Link>
  );
};

export default DashboardStatCard;