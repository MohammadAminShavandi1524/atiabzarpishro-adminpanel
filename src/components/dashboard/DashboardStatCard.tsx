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
      className="group/item border-border bg-background hover:bg-card-secondary/40 3xl:min-h-[76px] 3xl:gap-4 3xl:px-5 relative flex min-h-[76px] items-center gap-4 border px-5 transition-colors duration-300 xl:min-h-[68px] xl:gap-3 xl:px-4 2xl:min-h-[72px]"
    >
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/item:scale-y-100" />

      <Icon
        strokeWidth={1.7}
        className="text-custom-primary 3xl:size-[22px] size-[22px] shrink-0 xl:size-5"
      />

      <span className="text-foreground 3xl:text-[15px] min-w-0 flex-1 text-[15px] font-medium xl:text-[14px]">
        {title}
      </span>

      <span className="text-foreground 3xl:text-[22px] text-[22px] font-semibold xl:text-[20px]">
        {count}
      </span>

      <ArrowUpRight
        strokeWidth={1.6}
        className="text-muted-foreground group-hover/item:text-custom-primary 3xl:size-[18px] size-[18px] shrink-0 transition-colors duration-300 xl:size-4"
      />
    </Link>
  );
};

export default DashboardStatCard;
