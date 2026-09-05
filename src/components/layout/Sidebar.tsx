"use client";

import { useRef } from "react";

import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Video,
  ClipboardList,
  BookOpen,
  BookPlus,
  Newspaper,
  FilePenLine,
  Plus,
  Tags,
  BadgePlus,
  Cpu,
  FilePlus2,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollArea } from "@/components/ui/scroll-area";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import SideBarItemHeader from "./SideBarItemHeader";

gsap.registerPlugin(useGSAP);

const Sidebar = () => {
  const t = useTranslations("Sidebar");

  const locale = useLocale();
  const pathname = usePathname();

  const sidebarRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sidebarRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        sidebarRef.current,
        {
          opacity: 0,
          x: locale === "fa" ? 18 : -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
        },
      );

      timeline.fromTo(
        ".sidebar-brand",
        {
          opacity: 0,
          y: -10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".sidebar-section",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.055,
        },
        "-=0.2",
      );
    },
    {
      scope: sidebarRef,
      dependencies: [locale],
    },
  );

  if (pathname === `/${locale}/login`) {
    return null;
  }

  return (
    <aside
      ref={sidebarRef}
      className="border-e-border-secondary 3xl:w-75 flex h-screen w-75 shrink-0 flex-col border-e pb-4 xl:w-64 2xl:w-68"
    >
      {/* Header */}
      <div className="sidebar-brand 3xl:px-5 mb-4 shrink-0 px-5 xl:px-3.5 2xl:px-4">
        <div className="border-b-border-secondary 3xl:gap-x-2.25 flex w-full items-center gap-x-2.25 border-b ps-1 pt-4 pb-4 xl:gap-x-2 xl:pt-3.5 xl:pb-3.5 2xl:pt-4 2xl:pb-4">
          <Logo />

          <div className="flex min-w-0 flex-col">
            <div className="3xl:text-lg truncate text-lg font-medium xl:text-[16px] 2xl:text-[17px]">
              {t("logoTitle")}
            </div>

            <div className="text-muted-foreground 3xl:text-sm truncate text-sm xl:text-[12px] 2xl:text-[13px]">
              {t("logoSubtitle")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea
        dir={locale === "en" ? "ltr" : "rtl"}
        className="min-h-0 flex-1"
        scrollBarClassName="me-1.5"
      >
        <nav className="3xl:gap-y-3.5 3xl:px-5 flex flex-col gap-y-3.5 px-5 xl:gap-y-2.5 xl:px-3.5 2xl:gap-y-3 2xl:px-4">
          {/* Overview */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("overview")} />

            <SidebarItem
              href={`/${locale}`}
              title={t("dashboard")}
              icon={LayoutDashboard}
              active={pathname === `/${locale}`}
            />
          </div>

          {/* Requests */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("requests")} />

            <SidebarItem
              href={`/${locale}/client-requests`}
              title={t("clientRequests")}
              icon={ClipboardList}
              active={pathname.startsWith(`/${locale}/client-requests`)}
            />
          </div>

          {/* Brands */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("brandsSection")} />

            <SidebarItem
              href={`/${locale}/brands`}
              title={t("brands")}
              icon={Tags}
              active={pathname.startsWith(`/${locale}/brands`)}
            />

            <SidebarItem
              href={`/${locale}/add-brand`}
              title={t("addBrand")}
              icon={BadgePlus}
              active={pathname.startsWith(`/${locale}/add-brand`)}
            />
          </div>

          {/* Products */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("productsSection")} />

            <SidebarItem
              href={`/${locale}/products`}
              title={t("products")}
              icon={Package}
              active={pathname.startsWith(`/${locale}/products`)}
            />

            <SidebarItem
              href={`/${locale}/add-product`}
              title={t("addProduct")}
              icon={PackagePlus}
              active={pathname.startsWith(`/${locale}/add-product`)}
            />
          </div>

          {/* Video Clips */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("videoSection")} />

            <SidebarItem
              href={`/${locale}/video-clips`}
              title={t("videoClips")}
              icon={Video}
              active={pathname.startsWith(`/${locale}/video-clips`)}
            />

            <SidebarItem
              href={`/${locale}/add-video`}
              title={t("addVideoClip")}
              icon={Plus}
              active={pathname.startsWith(`/${locale}/add-video`)}
            />
          </div>

          {/* Catalogues */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("cataloguesSection")} />

            <SidebarItem
              href={`/${locale}/catalogues`}
              title={t("catalogues")}
              icon={BookOpen}
              active={pathname.startsWith(`/${locale}/catalogues`)}
            />

            <SidebarItem
              href={`/${locale}/add-catalogue`}
              title={t("addCatalogue")}
              icon={BookPlus}
              active={pathname.startsWith(`/${locale}/add-catalogue`)}
            />
          </div>

          {/* News */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("newsSection")} />

            <SidebarItem
              href={`/${locale}/news`}
              title={t("news")}
              icon={Newspaper}
              active={pathname.startsWith(`/${locale}/news`)}
            />

            <SidebarItem
              href={`/${locale}/add-news`}
              title={t("addNews")}
              icon={FilePenLine}
              active={pathname.startsWith(`/${locale}/add-news`)}
            />
          </div>

          {/* Tech News */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("techNewsSection")} />

            <SidebarItem
              href={`/${locale}/technews`}
              title={t("techNews")}
              icon={Cpu}
              active={pathname.startsWith(`/${locale}/technews`)}
            />

            <SidebarItem
              href={`/${locale}/add-technews`}
              title={t("addTechNews")}
              icon={FilePlus2}
              active={pathname.startsWith(`/${locale}/add-technews`)}
            />
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
