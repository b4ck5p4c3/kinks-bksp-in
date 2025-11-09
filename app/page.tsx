import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      <LanguageSwitcher />
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          <Image
            src="/logo.png"
            alt="Logo"
            width={128}
            height={128}
            className="rounded-2xl"
          />
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl">{t("title")}</CardTitle>
              <CardDescription>
              {t("description")}{" "}
              <a
                href="https://aella.substack.com/p/fetish-tabooness-vs-popularity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t("research")}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("howItWorks")}</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>{t("steps.step1")} (
                  <a
                    href="https://en.wikipedia.org/wiki/End-to-end_encryption"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    E2EE
                  </a>)
                </li>
                <li>{t("steps.step2")}</li>
                <li>{t("steps.step3")}</li>
                <li>{t("steps.step4")}</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Link href="/create" className="flex-1">
                <Button className="w-full" size="lg">
                  {t("createButton")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </>
  );
}
