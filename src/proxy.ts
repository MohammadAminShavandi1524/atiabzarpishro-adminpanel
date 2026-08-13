import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // اجرای next-intl برای مدیریت locale
  const response = intlMiddleware(request);

  const token = request.cookies.get("token")?.value;

  // استخراج locale از آدرس
  const locale =
    routing.locales.find((l) => pathname.startsWith(`/${l}`)) ??
    routing.defaultLocale;

  const loginPath = `/${locale}/login`;

  // اگر صفحه لاگین باشد
  if (pathname === loginPath) {
    if (token) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return response;
  }

  // اگر لاگین نکرده باشد
  if (!token) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
