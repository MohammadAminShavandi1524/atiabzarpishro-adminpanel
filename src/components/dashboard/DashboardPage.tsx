"use client";

import { useEffect, useState } from "react";

import {
  Clapperboard,
  MessageSquareText,
  Newspaper,
  PackageOpen,
  Tags,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import DashboardStatCard from "./DashboardStatCard";

import { getDashboardStats, type DashboardStats } from "./dashboard.api";
import DashboardQuickActions from "./DashboardQuickActions";

const DashboardPage = () => {
  const t = useTranslations("Dashboard");

  const locale = useLocale();

  const [stats, setStats] = useState<DashboardStats>({
    brands: 0,
    products: 0,
    videos: 0,
    news: 0,
    requests: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats(data);
      } catch (error) {
        console.error("GET DASHBOARD STATS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const items = [
    {
      key: "requests",
      title: t("cards.requests.title"),
      count: stats.requests,
      href: `/${locale}/client-requests`,
      icon: MessageSquareText,
    },
    {
      key: "brands",
      title: t("cards.brands.title"),
      count: stats.brands,
      href: `/${locale}/brands`,
      icon: Tags,
    },
    {
      key: "products",
      title: t("cards.products.title"),
      count: stats.products,
      href: `/${locale}/products`,
      icon: PackageOpen,
    },
    {
      key: "videos",
      title: t("cards.videos.title"),
      count: stats.videos,
      href: `/${locale}/video-clips`,
      icon: Clapperboard,
    },
    {
      key: "news",
      title: t("cards.news.title"),
      count: stats.news,
      href: `/${locale}/news`,
      icon: Newspaper,
    },
  ];

  if (loading) {
    return (
      <div className="border-border bg-card flex min-h-[420px] items-center justify-center border">
        <div className="flex items-center gap-3">
          <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

          <span className="text-muted-foreground text-sm">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <section>
        <div className="space-y-3">
          {items.map((item) => (
            <DashboardStatCard
              key={item.key}
              title={item.title}
              count={item.count}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </section>

      <DashboardQuickActions />
    </>
  );
};

export default DashboardPage;
