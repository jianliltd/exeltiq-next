'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Package } from 'lucide-react';

import useTranslate from '@/hook/use-translate';

interface AssignedPackagesProps {
  packages: any[];
  isLoading: boolean;
}

export const AssignedPackages = ({ packages, isLoading }: AssignedPackagesProps) => {
  const { t } = useTranslate();

  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t("clientDetail.assignedPackages")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : packages && packages.length > 0 ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((assignment: any) => (
              <div
                key={assignment.id}
                className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-semibold mb-1">{assignment.packages.title}</h4>
                {assignment.packages.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {assignment.packages.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {assignment.packages.session_count} {t("clientDetail.sessions")}
                  </span>
                  <span className="font-medium">
                    ${Number(assignment.packages.price).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">{t("clientDetail.noPackagesAssigned")}</p>
        )}
      </CardContent>
    </Card>
  );
};
