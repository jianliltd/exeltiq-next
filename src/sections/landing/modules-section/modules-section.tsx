import { CheckCircle2, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import useTranslate from "@/hook/use-translate";

export const ModulesSection = () => {
  const { t } = useTranslate();

  return (
    <section className="py-28 bg-secondary">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold text-foreground">
          {t("landing.modulesTitlePart1")} <span className="text-primary">{t("landing.modulesTitlePart2")}</span>
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          {t("landing.modulesSubtitle")}
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card className="shadow-elevated border-2 border-primary bg-white hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <span className="text-sm font-semibold text-primary">
                    {t("landing.nowAvailable")}
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-foreground">
                  {t("landing.gymManagement")}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("landing.gymManagementDesc")}
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-base font-medium">
                      {t("landing.gymFeatureMember")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-base font-medium">
                      {t("landing.gymFeatureClass")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-base font-medium">
                      {t("landing.gymFeatureQr")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-base font-medium">
                      {t("landing.gymFeatureTracking")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-primary/5 rounded-2xl flex items-center justify-center">
                  <Users className="h-32 w-32 text-primary" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-6 py-3 rounded-xl shadow-lg">
                  <span className="font-bold text-lg">{t("landing.activeModule")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            {t("landing.moreModulesComing")}
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};