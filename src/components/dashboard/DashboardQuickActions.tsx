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
    <section className="3xl:mt-8 mt-8 xl:mt-6 2xl:mt-7">
      <div className="3xl:mb-4 3xl:gap-3 mb-4 flex items-center gap-3 xl:mb-3 xl:gap-2.5">
        <CirclePlus
          strokeWidth={1.7}
          className="text-custom-primary 3xl:size-[18px] size-[18px] xl:size-4"
        />

        <h2 className="text-foreground 3xl:text-base text-base font-semibold xl:text-[15px]">
          {t("quickActions.title")}
        </h2>
      </div>

      <div className="3xl:gap-3 grid grid-cols-4 gap-3 xl:gap-2.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className="group/action border-border bg-background hover:border-custom-primary/40 hover:bg-card-secondary/40 3xl:min-h-[82px] 3xl:gap-4 3xl:px-5 flex min-h-[82px] items-center gap-4 border px-5 transition-[background-color,border-color] duration-300 xl:min-h-[72px] xl:gap-3 xl:px-4 2xl:min-h-[76px]"
            >
              <Icon
                strokeWidth={1.7}
                className="text-custom-primary 3xl:size-[21px] size-[21px] shrink-0 xl:size-5"
              />

              <span className="text-foreground text-sm font-medium xl:text-[13px] 2xl:text-sm">
                {item.title}
              </span>

              <CirclePlus
                strokeWidth={1.6}
                className="text-muted-foreground group-hover/action:text-custom-primary 3xl:size-[17px] ms-auto size-[17px] shrink-0 transition-colors duration-300 xl:size-4"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardQuickActions;
