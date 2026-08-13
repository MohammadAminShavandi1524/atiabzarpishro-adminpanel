"use client";

import { Bell, LogOut, Search } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeButton } from "../theme/ThemeButton";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { CustomButton } from "../ui/custom-button";

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

  const handleLogout = async () => {
    await logout();

    router.replace(`/${locale}/login`);
    router.refresh();
  };

  return (
    <div
      className={cn(
        "border-b-border-secondary flex justify-between border-b px-8 py-6",
        className,
      )}
    >
      <div>
        <h1 className="mb-2 text-[26px] font-semibold">{title}</h1>

        <p className="text-muted-foreground text-lg">{descrption}</p>
      </div>

      <div className="flex items-center gap-x-2 pe-4">
        <ThemeButton />
        <LanguageSwitcher defaultLocale={locale} />

        <CustomButton
          intent="primary"
          variant="solid"
          size="lg"
          leftSection={
            <LogOut className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
          }
          onClick={handleLogout}
          className="group h-13"
        >
          {locale === "en" ? "Log out" : "خروج"}
        </CustomButton>
      </div>
    </div>
  );
};

export default HeaderLayout;
