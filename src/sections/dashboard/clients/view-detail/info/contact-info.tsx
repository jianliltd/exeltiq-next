'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Building, Mail, MapPin, Phone } from 'lucide-react';

import useTranslate from '@/hook/use-translate';
import { Client } from '../../type';

interface ContactInfoProps {
  client: Client;
}

export const ContactInfo = ({ client }: ContactInfoProps) => {
  const { t } = useTranslate();

  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {t("clientDetail.contactInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {client.company_name && (
          <div className="flex items-start gap-3">
            <Building className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.company")}</p>
              <p className="font-medium">{client.company_name}</p>
            </div>
          </div>
        )}
        {client.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.email")}</p>
              <p className="font-medium">{client.email}</p>
            </div>
          </div>
        )}
        {client.phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.phone")}</p>
              <p className="font-medium">{client.phone}</p>
            </div>
          </div>
        )}
        {(client.address || client.city || client.country) && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t("clientDetail.address")}</p>
              <p className="font-medium">
                {[client.address, client.city, client.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};