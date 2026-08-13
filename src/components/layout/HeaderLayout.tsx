"use client";

import { Bell, LogOut, Search } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeButton } from "../theme/ThemeButton";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
// import { logout } from "@/services/auth";
import { cn } from "@/lib/utils";
import { CustomButton } from "../ui/custom-button";

interface HeaderLayoutProps {
  title: string;
  descrption: string;
  className?: string;
}

const HeaderLayout = ({ title, descrption, className }: HeaderLayoutProps) => {
  const locale = useLocale();
  const router = useRouter();

  // const handleLogout = async () => {
  //   await logout();

  //   router.replace(`/${locale}/login`);
  //   router.refresh();
  // };

  return (
    <div
      className={cn(
        "border-b-border-secondary flex justify-between border-b px-8 py-6",
        className,
      )}
    >
      <div>
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>

        <p className="text-muted-foreground text-lg">{descrption}</p>
      </div>

      <div className="flex items-center gap-x-2 pe-4">
        <ThemeButton />
        <LanguageSwitcher defaultLocale={locale} />

        {/* <CustomButton
          intent="primary"
          variant="solid"
          leftSection={
            <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          }
          onClick={handleLogout}
          className="group h-11 rounded-xl px-4 text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md active:scale-95"
        >
          {locale === "en" ? "Log out" : "خروج"}
        </CustomButton> */}
      </div>
    </div>
  );
};

export default HeaderLayout;
