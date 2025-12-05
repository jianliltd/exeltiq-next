import { Card, CardContent } from "@/components/ui/card";

import { CheckCircle2 } from "lucide-react";

import useTranslate from "@/hook/use-translate";

export const BenefitsSection = () => {
  const { t } = useTranslate();

  const benefits = [
    t("landing.benefitRealtimeRevenue"),
    t("landing.benefitClientDeal"),
    t("landing.benefitBookingScheduling"),
    t("landing.benefitTeamTools"),
    t("landing.benefitAnalyticsDashboard"),
    t("landing.benefitPerformanceInsights"),
  ];

  return (
    <section className="py-28 bg-white">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
            {t("landing.benefitsTitlePart1")} <span className="text-primary">{t("landing.benefitsTitlePart2")}</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {t("landing.benefitsSubtitle")}
          </p>
          <div className="space-y-5 pt-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="shrink-0">
                  <CheckCircle2 className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-lg md:text-xl font-medium text-foreground">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Card className="shadow-elevated border-border bg-white transition-all duration-300">
            <CardContent className="p-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <span className="font-semibold text-lg text-foreground">
                    {t("landing.teamPerformance")}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    +247%
                  </span>
                </div>
                <div className="flex items-center justify-between p-6 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <span className="font-semibold text-lg text-foreground">
                    {t("landing.clientSatisfaction")}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    98%
                  </span>
                </div>
                <div className="flex items-center justify-between p-6 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <span className="font-semibold text-lg text-foreground">
                    {t("landing.timeSaved")}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    15 hrs/week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
  );
};