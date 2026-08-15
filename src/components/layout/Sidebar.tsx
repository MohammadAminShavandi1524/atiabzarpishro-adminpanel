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
  FileText,
  FilePlus2,
  Newspaper,
  FilePenLine,
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
      if (!sidebarRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

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

  if (pathname === `/${locale}/login`) return null;

  return (
    <aside
      ref={sidebarRef}
      className="border-e-border-secondary flex h-screen w-75 flex-col border-e pb-4"
    >
      {/* Header */}
      <div className="sidebar-brand mb-4 shrink-0 px-5">
        <div className="border-b-border-secondary flex w-full items-center gap-x-2.25 border-b ps-1 pt-4 pb-4">
          <Logo />

          <div className="flex flex-col">
            <div className="text-xl font-medium">{t("logoTitle")}</div>

            <div className="text-muted-foreground text-sm">
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
        <nav className="flex flex-col gap-y-4 px-5">
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

          {/* Brochures */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("brochuresSection")} />

            <SidebarItem
              href={`/${locale}/brochures`}
              title={t("brochures")}
              icon={FileText}
              active={pathname.startsWith(`/${locale}/brochures`)}
            />

            <SidebarItem
              href={`/${locale}/add-brochure`}
              title={t("addBrochure")}
              icon={FilePlus2}
              active={pathname.startsWith(`/${locale}/add-brochure`)}
            />
          </div>

          {/* Blogs */}
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
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
