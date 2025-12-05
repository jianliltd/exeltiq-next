import { Card, CardContent } from "@/components/ui/card";

import { BarChart3, Calendar, Shield, TrendingUp, Users, Zap } from "lucide-react";

import useTranslate from "@/hook/use-translate";

export const FeaturesSection = () => {
  const { t } = useTranslate();

  const features = [
    {
      icon: Users,
      title: t("landing.clientManagement"),
      description: t("landing.clientManagementDesc"),
    },
    {
      icon: Calendar,
      title: t("landing.bookingSystem"),
      description: t("landing.bookingSystemDesc"),
    },
    {
      icon: TrendingUp,
      title: t("landing.salesPipeline"),
      description: t("landing.salesPipelineDesc"),
    },
    {
      icon: BarChart3,
      title: t("landing.revenueAnalytics"),
      description: t("landing.revenueAnalyticsDesc"),
    },
    {
      icon: Shield,
      title: t("landing.teamCollaboration"),
      description: t("landing.teamCollaborationDesc"),
    },
    {
      icon: Zap,
      title: t("landing.performanceMetrics"),
      description: t("landing.performanceMetricsDesc"),
    },
  ];
  
  return (
    <section className="py-28 bg-secondary">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold text-foreground">
          {t("landing.featuresTitlePart1")} {t("landing.featuresTitlePart2")}
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          {t("landing.featuresSubtitle")}
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="shadow-card border-border bg-white hover:shadow-elevated hover:border-primary/50 transition-all duration-300 group"
          >
            <CardContent className="p-10 space-y-4">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-all">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  );
};