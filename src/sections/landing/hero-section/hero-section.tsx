import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";

import useTranslate from "@/hook/use-translate";

export const HeroSection = () => {
  const { t } = useTranslate();

  return (
    <section className="relative py-24 md:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center animate-in space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-foreground">
              {t("landing.heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("landing.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Link href="#" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 py-7 font-semibold"
                >
                  {t("landing.startYourFreeTrial")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-10 py-7 font-semibold border-2"
              >
                {t("landing.watchDemo")}
              </Button>
            </div>
            <p className="mt-8 text-base text-muted-foreground">
              {t("landing.freeTrialInfo")}
            </p>
          </div>
        </div>
      </section>
  );
};