'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Calendar, DollarSign, Mail, Phone } from 'lucide-react';

import useTranslate from '@/hook/use-translate';

import { Client } from '../../../type';

interface GridViewProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
}

export const GridView = ({ clients, onClientClick }: GridViewProps) => {
  const { t } = useTranslate();

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card
          key={client.id}
          className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300 group cursor-pointer"
          onClick={() => onClientClick(client.id)}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{client.name}</h3>
                  <span
                    className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {client.status === 'active' ? t('clients.active') : t('clients.inactive')}
                  </span>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {client.name?.charAt(0) || '?'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs">{t('clients.totalValue')}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    $
                    {client.totalValue?.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || '0.00'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{t('clients.bookings')}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {client.bookingsCount || 0}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <Button variant="default" className="w-full">
                {t('clients.viewDetails')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GridView;

