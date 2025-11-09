import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n/config";

export function middleware(request: NextRequest) {
  // Get locale from cookie or default to 'en'
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

  // Validate locale
  const validLocale = locales.includes(locale as any) ? locale : "en";

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", validLocale);

  // Return response with the locale header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Match all pathnames except api, _next, static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
