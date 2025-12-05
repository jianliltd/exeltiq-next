'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Mail, Phone } from 'lucide-react';

import useTranslate from '@/hook/use-translate';

import { Client } from '../../../type';

interface ListViewProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
}

export const ListView = ({ clients, onClientClick }: ListViewProps) => {
  const { t } = useTranslate();

  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onClientClick(client.id)}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Left: Avatar and Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">
                      {client.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {client.status === 'active'
                          ? t('clients.active')
                          : t('clients.inactive')}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('clients.totalValue')}
                    </div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      $
                      {client.totalValue?.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || '0.00'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('clients.bookings')}
                    </div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {client.bookingsCount || 0}
                    </p>
                  </div>
                  <Button variant="default" size="sm" className="hidden sm:inline-flex">
                    {t('common.view')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListView;

