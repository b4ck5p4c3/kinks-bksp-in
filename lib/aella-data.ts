import aellaDataJson from "@/aella_data.json";
import aellaDataTestJson from "@/aella_data.test.json";
import type { Locale } from "@/i18n/config";

export interface KinkData {
  tabooness: number;
  popularity: number;
  i18n?: {
    en: string;
    ru: string;
  };
}

export type AellaData = Record<string, KinkData>;

// Use test data if USE_TEST_DATA environment variable is set to "true"
const useTestData = process.env.NEXT_PUBLIC_USE_TEST_DATA === "true";

export const aellaData: AellaData = useTestData ? aellaDataTestJson : aellaDataJson;

export const kinkNames = Object.keys(aellaData);
export const kinkCount = kinkNames.length;

export function getKinkData(kinkName: string): KinkData | undefined {
  return aellaData[kinkName];
}

export function getKinkDisplayName(kinkName: string, locale: Locale): string {
  const kinkData = getKinkData(kinkName);
  if (kinkData?.i18n && kinkData.i18n[locale]) {
    return kinkData.i18n[locale];
  }
  // Fallback to original name with capitalization
  return kinkName.charAt(0).toUpperCase() + kinkName.slice(1);
}
