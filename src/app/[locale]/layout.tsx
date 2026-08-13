import "../globals.css";
import "../../Webfonts/fontiran.css";

import { notFound } from "next/navigation";
import { Locale, hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  Inter,
  Playfair_Display,
  Space_Grotesk,
  Noto_Serif,
} from "next/font/google";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/Providers";
import AppToaster from "@/components/AppToaster";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

// import {
//   MobileSidebar,
//   MobileSidebarContent,
// } from "@/components/ui/mobile-sidebar";
// import MobileMenu from "@/components/mobile-menu/mobile-menu";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "LocaleLayout",
  });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={locale === "en" ? "ltr" : "rtl"}
      suppressHydrationWarning
    >
      <body
        className={cn(
          inter.variable,
          playfair.variable,
          space.variable,
          notoSerif.variable,

          locale === "fa" ? "font-IRANYekanX" : space.className,
        )}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <AppToaster />

            <div className="text-foreground bg-background relative">
              <Header />

              <main className="">{children}</main>

              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
