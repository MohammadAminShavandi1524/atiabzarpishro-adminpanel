"use client";

import Link from "next/link";

import {
  BadgePlus,
  CirclePlus,
  FilePlus2,
  PackagePlus,
  Video,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

const DashboardQuickActions = () => {
  const locale = useLocale();

  const t = useTranslations("Dashboard");

  const items = [
    {
      key: "brand",
      title: t("quickActions.brand"),
      href: `/${locale}/add-brand`,
      icon: BadgePlus,
    },
    {
      key: "product",
      title: t("quickActions.product"),
      href: `/${locale}/add-product`,
      icon: PackagePlus,
    },
    {
      key: "video",
      title: t("quickActions.video"),
      href: `/${locale}/add-video`,
      icon: Video,
    },
    {
      key: "news",
      title: t("quickActions.news"),
      href: `/${locale}/add-news`,
      icon: FilePlus2,
    },
  ];

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-3">
        <CirclePlus
          size={18}
          strokeWidth={1.7}
          className="text-custom-primary"
        />

        <h2 className="text-foreground text-base font-semibold">
          {t("quickActions.title")}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className="group/action border-border bg-background hover:border-custom-primary/40 hover:bg-card-secondary/40 flex min-h-[82px] items-center gap-4 border px-5 transition-[background-color,border-color] duration-300"
            >
              <Icon
                size={21}
                strokeWidth={1.7}
                className="text-custom-primary shrink-0"
              />

              <span className="text-foreground text-sm font-medium">
                {item.title}
              </span>

              <CirclePlus
                size={17}
                strokeWidth={1.6}
                className="text-muted-foreground group-hover/action:text-custom-primary ms-auto transition-colors duration-300"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardQuickActions;
