"use client";

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

import { ScrollArea } from "@/components/ui/scroll-area";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import SideBarItemHeader from "./SideBarItemHeader";

const Sidebar = () => {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const pathname = usePathname();

  if (pathname === `/${locale}/login`) return null;

  return (
    <aside className="border-e-border-secondary flex h-screen w-75 flex-col border-e pb-4">
      {/* Header */}
      <div className="mb-4 shrink-0 px-5">
        <div className="border-b-border-secondary flex w-full items-center gap-x-3 border-b ps-1 pt-4 pb-4">
          <Logo />

          <div className="flex flex-col pt-0.5">
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
          <div>
            <SideBarItemHeader label={t("overview")} />

            <SidebarItem
              href={`/${locale}`}
              title={t("dashboard")}
              icon={LayoutDashboard}
              active={pathname === `/${locale}`}
            />
          </div>

          {/* Products */}
          <div>
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
          <div>
            <SideBarItemHeader label={t("videoSection")} />

            <SidebarItem
              href={`/${locale}/video-clips`}
              title={t("videoClips")}
              icon={Video}
              active={pathname.startsWith(`/${locale}/video-clips`)}
            />
          </div>

          {/* Requests */}
          <div>
            <SideBarItemHeader label={t("requests")} />

            <SidebarItem
              href={`/${locale}/client-requests`}
              title={t("clientRequests")}
              icon={ClipboardList}
              active={pathname.startsWith(`/${locale}/client-requests`)}
            />
          </div>

          {/* Catalogues */}
          <div>
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
          <div>
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
          <div>
            <SideBarItemHeader label={t("blogsSection")} />

            <SidebarItem
              href={`/${locale}/blogs`}
              title={t("blogs")}
              icon={Newspaper}
              active={pathname.startsWith(`/${locale}/blogs`)}
            />

            <SidebarItem
              href={`/${locale}/add-blog`}
              title={t("addBlog")}
              icon={FilePenLine}
              active={pathname.startsWith(`/${locale}/add-blog`)}
            />
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
