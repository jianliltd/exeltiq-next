import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-gradient-primary",
}: MetricCardProps) {
  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="mt-3 text-4xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={cn(
                  "mt-3 text-sm font-semibold flex items-center gap-1",
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-lg rounded-lg transition-opacity duration-300 group-hover:opacity-40"></div>
            <div className={cn("relative p-3 rounded-lg", iconColor)}>
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
