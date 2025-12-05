import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ArrowRight, Globe } from "lucide-react";

import useTranslate from "@/hook/use-translate";

export const CTASection = () => {
  const { t } = useTranslate();
  
  return (
    <section className="py-28 bg-[hsl(0,0%,5%)]">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <Globe className="h-20 w-20 mx-auto text-[hsl(219,100%,65%)]" />
        <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
          {t("landing.ctaTitle")}
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t("landing.ctaSubtitle")}
        </p>
        <div className="pt-4">
          <Link href="#">
            <Button size="lg" className="text-lg px-12 py-8 font-semibold bg-[hsl(219,100%,65%)] hover:bg-[hsl(219,100%,70%)] text-white">
              {t("landing.getStartedFree")}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
  );
};