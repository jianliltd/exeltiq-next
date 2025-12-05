'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AlertTriangle, DollarSign, Heart, StickyNote } from 'lucide-react';

import useTranslate from '@/hook/use-translate';
import { Client } from '../../type';

interface ClientDetailInfoProps {
  client: Client;
}

export const ClientDetailInfo = ({ client }: ClientDetailInfoProps) => {
  const { t } = useTranslate();

  const totalValue = client.deals?.reduce((sum: number, deal: any) => 
    deal.status === 'closed' ? sum + (Number(deal.value) || 0) : sum, 0) || 0;

  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          {t("clientDetail.clientDetails")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {client.budget && (
          <div className="flex items-start gap-3">
            <DollarSign className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.budget")}</p>
              <p className="font-medium">{client.budget}</p>
            </div>
          </div>
        )}
        {client.allergies && (
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 mt-1 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.allergies")}</p>
              <p className="font-medium">{client.allergies}</p>
            </div>
          </div>
        )}
        {client.preferences && (
          <div className="flex items-start gap-3">
            <Heart className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.preferences")}</p>
              <p className="font-medium">{client.preferences}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("clientDetail.totalValue")}</p>
            <p className="font-medium">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("clientDetail.totalBookings")}</p>
            <p className="font-medium">{client.bookingsCount || 0}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("clientDetail.totalSessions")}</p>
            <p className="font-medium">
              {client.totalSessions || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("clientDetail.usedSessions")}</p>
            <p className="font-medium">{client.sessionsUsed || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("clientDetail.remainingSessions")}</p>
            <p className="font-medium">{client.sessionsRemaining || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


