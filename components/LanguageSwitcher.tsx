"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { locales } from "@/i18n/config";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const [locale, setLocale] = useState(currentLocale);

  useEffect(() => {
    // Initialize from localStorage on mount
    const stored = localStorage.getItem("locale");
    if (stored && locales.includes(stored as any)) {
      setLocale(stored);
      // Set cookie for server-side
      document.cookie = `NEXT_LOCALE=${stored}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      // Detect from browser if not in localStorage
      const browserLang = navigator.language.split("-")[0];
      const detectedLocale = locales.includes(browserLang as any) ? browserLang : "en";
      setLocale(detectedLocale);
      localStorage.setItem("locale", detectedLocale);
      document.cookie = `NEXT_LOCALE=${detectedLocale}; path=/; max-age=31536000; SameSite=Lax`;
      switchLocale(detectedLocale);
    }
  }, []);

  const switchLocale = (newLocale: string) => {
    setLocale(newLocale);
    // Store in localStorage
    localStorage.setItem("locale", newLocale);
    // Set cookie for server-side
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh to apply new locale
    router.refresh();
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-1 border">
      {locales.map((loc) => (
        <Button
          key={loc}
          onClick={() => switchLocale(loc)}
          variant={locale === loc ? "default" : "ghost"}
          size="sm"
          className="w-12 h-8 text-xs font-semibold"
        >
          {loc.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
