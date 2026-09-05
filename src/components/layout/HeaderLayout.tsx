"use client";

import { useRef } from "react";

import { LogOut } from "lucide-react";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeButton } from "../theme/ThemeButton";
import { CustomButton } from "../ui/custom-button";

gsap.registerPlugin(useGSAP);

interface HeaderLayoutProps {
  title: string;
  descrption: string;
  className?: string;
}

export const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

const HeaderLayout = ({ title, descrption, className }: HeaderLayoutProps) => {
  const locale = useLocale();
  const router = useRouter();

  const headerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();

    router.replace(`/${locale}/login`);
    router.refresh();
  };

  useGSAP(
    () => {
      if (!headerRef.current) return;

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
        headerRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.35,
        },
      );

      timeline.fromTo(
        ".header-title",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".header-description",
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".header-control",
        {
          opacity: 0,
          x: locale === "fa" ? -10 : 10,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.07,
        },
        "-=0.35",
      );
    },
    {
      scope: headerRef,
      dependencies: [locale],
    },
  );

  return (
    <div
      ref={headerRef}
      className={cn(
        `border-b-border-secondary 3xl:px-8 3xl:py-6 flex shrink-0 items-center justify-between border-b px-8 py-6 xl:px-5 xl:py-5 2xl:px-6`,
        className,
      )}
    >
      {/* Page Info */}
      <div className="min-w-0 pe-6">
        <h1 className="header-title 3xl:text-[26px] mb-2 text-[26px] font-semibold xl:text-[22px] 2xl:text-[24px]">
          {title}
        </h1>

        <p className="header-description text-muted-foreground 3xl:text-lg text-lg xl:text-base 2xl:text-[17px]">
          {descrption}
        </p>
      </div>

      {/* Controls */}
      <div className="3xl:pe-4 flex shrink-0 items-center gap-x-2 pe-4 xl:gap-x-1.5 xl:pe-0 2xl:gap-x-2">
        <div className="header-control">
          <ThemeButton />
        </div>

        <div className="header-control">
          <LanguageSwitcher defaultLocale={locale} />
        </div>

        <div className="header-control">
          <CustomButton
            intent="primary"
            variant="solid"
            size="lg"
            leftSection={
              <LogOut className="3xl:size-5 size-5 transition-transform duration-300 group-hover:-translate-x-0.5 xl:size-4.5 rtl:group-hover:translate-x-0.5" />
            }
            onClick={handleLogout}
            className="group 3xl:h-13 3xl:px-5 3xl:text-[15px] h-13 xl:h-11 xl:px-4 xl:text-sm 2xl:h-12"
          >
            {locale === "en" ? "Log out" : "خروج"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
