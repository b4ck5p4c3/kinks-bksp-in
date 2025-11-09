"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProfileView } from "@/components/ProfileView";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface ProfileData {
  nickname: string;
  data: string;
  isEncrypted: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const shortId = params.shortId as string;
  const t = useTranslations("profile");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/profiles/${shortId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(t("notFound"));
          } else {
            setError(t("error"));
          }
          return;
        }

        const data: ProfileData = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [shortId, t]);

  if (loading) {
    return (
      <>
        <LanguageSwitcher />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-xl">{t("loading")}</div>
        </main>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <LanguageSwitcher />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-destructive">{error || t("notFound")}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <LanguageSwitcher />
      <ProfileView profile={profile} />
    </>
  );
}
