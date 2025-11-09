"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProfileChart } from "@/components/ProfileChart";
import { PasswordPrompt } from "@/components/PasswordPrompt";
import { decryptData } from "@/lib/encryption";
import { Button } from "@/components/ui/button";

interface ProfileData {
  nickname: string;
  data: string;
  isEncrypted: boolean;
  createdAt: string;
}

interface ProfileViewProps {
  profile: ProfileData;
}

export function ProfileView({ profile }: ProfileViewProps) {
  const t = useTranslations("profile");
  const [personalData, setPersonalData] = useState<Record<string, number> | null>(
    profile.isEncrypted ? null : JSON.parse(profile.data)
  );
  const [needsPassword, setNeedsPassword] = useState(profile.isEncrypted);
  const [copied, setCopied] = useState(false);

  const handlePasswordSubmit = (password: string) => {
    try {
      const decrypted = decryptData(profile.data, password);
      const parsedData = JSON.parse(decrypted);
      setPersonalData(parsedData);
      setNeedsPassword(false);
    } catch (e) {
      console.error("Decryption failed:", e);
      alert(t("error"));
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (needsPassword) {
    return <PasswordPrompt onSubmit={handlePasswordSubmit} />;
  }

  if (!personalData) {
    return <div className="text-xl">No data available</div>;
  }

  return (
    <main className="min-h-screen">
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <h1 className="text-3xl font-bold">{t("title", { nickname: profile.nickname })}</h1>
            </div>
            <Button onClick={handleCopyLink} variant="outline">
              {copied ? t("copied") : t("shareButton")}
            </Button>
          </div>

          <div className="mb-6">
            <div className="text-center mb-2">{t("scaleTitle")}</div>
            <div className="grid grid-cols-3 gap-4 mb-2 text-sm">
              <span className="text-left">{t("scaleLabels.love")}</span>
              <span className="text-center">{t("scaleLabels.indifferent")}</span>
              <span className="text-right">{t("scaleLabels.taboo")}</span>
            </div>
            <div
              className="h-10 w-full rounded"
              style={{
                background: "linear-gradient(90deg, rgb(120, 255, 120) 0%, rgb(255, 120, 120) 100%)",
              }}
            />
          </div>

          <div className="bg-card rounded-xl p-4 border">
            <div className="text-center mb-4">
              <span className="text-lg">
                {t("chartTitle")}{" "}
                <a
                  href="https://aella.substack.com/p/fetish-tabooness-vs-popularity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t("research")}
                </a>
              </span>
            </div>
            <ProfileChart personalData={personalData} />
          </div>
        </div>
      </div>
    </main>
  );
}
