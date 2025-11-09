import Image from "next/image";
import { useTranslations } from "next-intl";
import { StepWizard } from "@/components/StepWizard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function CreatePage() {
  const t = useTranslations("create");

  return (
    <>
      <LanguageSwitcher />
      <main className="min-h-screen py-8">
        <div className="container mx-auto">
          <div className="max-w-4xl m-auto flex items-center gap-4 mb-8 px-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold flex-1 text-right">
              {t("title")}
            </h1>
          </div>
          <StepWizard />
        </div>
      </main>
    </>
  );
}
