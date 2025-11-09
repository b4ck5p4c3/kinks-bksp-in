"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { KinkRatingSlider } from "@/components/KinkRatingSlider";
import { kinkNames } from "@/lib/aella-data";
import { encryptData } from "@/lib/encryption";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

const KINKS_PER_PAGE = 25;
const totalPages = Math.ceil(kinkNames.length / KINKS_PER_PAGE);

export function StepWizard() {
  const router = useRouter();
  const t = useTranslations("wizard");
  const [currentPage, setCurrentPage] = useState(0);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kinks-progress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNickname(data.nickname || "");
        setPassword(data.password || "");
        setRatings(data.ratings || {});
        setCurrentPage(data.currentPage || 0);
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      "kinks-progress",
      JSON.stringify({ nickname, password, ratings, currentPage })
    );
  }, [nickname, password, ratings, currentPage]);

  const handleRatingChange = (kinkName: string, value: number) => {
    setRatings((prev) => ({ ...prev, [kinkName]: value }));
  };

  // Calculate kinks for current page (page 0 is info, so subtract 1 for kinks pages)
  const kinksPageIndex = currentPage > 0 ? currentPage - 1 : 0;
  const currentKinks = kinkNames.slice(
    kinksPageIndex * KINKS_PER_PAGE,
    (kinksPageIndex + 1) * KINKS_PER_PAGE
  );

  const progress = ((currentPage + 1) / (totalPages + 1)) * 100;

  const canGoNext = currentPage < totalPages;
  const canSubmit = currentPage === totalPages && nickname.trim().length > 0;

  const handleNext = () => {
    if (canGoNext) {
      window.scrollTo(0, 0);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      // Prepare data
      const dataToSave = JSON.stringify(ratings);
      const isEncrypted = password.trim().length > 0;
      const finalData = isEncrypted
        ? encryptData(dataToSave, password)
        : dataToSave;

      // Submit to API
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          data: finalData,
          isEncrypted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      const result = await response.json();

      // Clear localStorage
      localStorage.removeItem("kinks-progress");

      // Redirect to profile
      router.push(`/${result.shortId}`);
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {currentPage === 0 && t("step", { current: 1, total: totalPages + 1 })}
            {currentPage > 0 &&
              currentPage < totalPages &&
              t("kinks.title", {
                start: (currentPage - 1) * KINKS_PER_PAGE + 1,
                end: Math.min(currentPage * KINKS_PER_PAGE, kinkNames.length),
                total: kinkNames.length
              })}
            {currentPage === totalPages && t("summary.title")}
          </CardTitle>
          <div className="mt-4">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground mt-2">
              {t("step", { current: currentPage + 1, total: totalPages + 1 })} - {Math.round(progress)}%
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentPage === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("info.nickname")}
                </label>
                <Input
                  placeholder={t("info.nicknamePlaceholder")}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("info.password")}
                </label>
                <Input
                  type="password"
                  placeholder={t("info.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("info.passwordHelp")}
                </p>
              </div>
            </div>
          )}

          {currentPage > 0 && currentPage <= totalPages && (
            <div className="space-y-4">
              {currentKinks.map((kinkName) => (
                <KinkRatingSlider
                  key={kinkName}
                  kinkName={kinkName}
                  value={ratings[kinkName] ?? null}
                  onChange={(value) => handleRatingChange(kinkName, value)}
                />
              ))}
            </div>
          )}

          {currentPage === totalPages && (
            <div className="space-y-4">
              <p>{t("summary.kinksRated")} {Object.keys(ratings).length} / {kinkNames.length}</p>
              <p>{t("summary.nickname")} <strong>{nickname}</strong></p>
              <p>
                {t("summary.encrypted")} <strong>{password ? t("summary.yes") : t("summary.no")}</strong>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentPage === 0 || isSubmitting}
          >
            {t("previous")}
          </Button>
          {currentPage < totalPages && (
            <Button
              onClick={handleNext}
              disabled={currentPage === 0 && !nickname.trim()}
            >
              {t("next")}
            </Button>
          )}
          {currentPage === totalPages && (
            <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? t("summary.creating") : t("submit")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
