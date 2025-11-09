"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getKinkDisplayName } from "@/lib/aella-data";
import type { Locale } from "@/i18n/config";

interface KinkRatingSliderProps {
  kinkName: string;
  value: number | null;
  onChange: (value: number) => void;
}

const RATING_VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function KinkRatingSlider({
  kinkName,
  value,
  onChange,
}: KinkRatingSliderProps) {
  const t = useTranslations("wizard.kinks.scaleLabels");
  const locale = useLocale() as Locale;
  const displayName = getKinkDisplayName(kinkName, locale);

  // Color interpolation from green (100) to red (0)
  const getColor = (rating: number) => {
    const t = rating / 100;
    const r = Math.round(255 - (135 * t)); // 255 -> 120
    const g = Math.round(120 + (135 * t)); // 120 -> 255
    const b = 120;
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-3">
      <div className="text-base font-medium">{displayName}</div>

      {/* Scale labels */}
      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
        <span className="text-left">{t("taboo")}</span>
        <span className="text-center">{t("indifferent")}</span>
        <span className="text-right">{t("love")}</span>
      </div>

      {/* Rating buttons */}
      <div className="grid grid-cols-11 gap-1">
        {RATING_VALUES.map((rating) => (
          <Button
            key={rating}
            onClick={() => onChange(rating)}
            variant={value === rating ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-12 px-0 transition-all",
              value === rating && "ring-2 ring-offset-2 ring-offset-background"
            )}
            style={
              value === rating
                ? {
                  backgroundColor: getColor(rating),
                  borderColor: getColor(rating),
                  color: rating > 50 ? "#000" : "#fff",
                }
                : {
                  backgroundColor: getColor(rating),
                  borderColor: getColor(rating),
                  opacity: 0.3,
                }
            }
          >
            <span className="sr-only">{rating}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
