import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Pagination } from '../pagination';

import useTranslate from '@/hook/use-translate';

import { RevenueMetrics } from '../../type';

interface TopClientsProps {
  metrics: RevenueMetrics;
  formatCurrency: (amount: number) => string;
}

export const TopClients = ({ metrics, formatCurrency }: TopClientsProps) => {
  const { t } = useTranslate();

  const [clientsPage, setClientsPage] = useState(1);
  const [clientsPageSize, setClientsPageSize] = useState(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('revenue.topClientsByRevenue')}</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.topClients.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {t('revenue.noClientData')}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('revenue.rank')}</TableHead>
                    <TableHead>{t('revenue.clientName')}</TableHead>
                    <TableHead className="text-right">{t('revenue.totalRevenue')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.topClients
                    .slice((clientsPage - 1) * clientsPageSize, clientsPage * clientsPageSize)
                    .map((client, index) => (
                      <TableRow key={client.name}>
                        <TableCell>#{(clientsPage - 1) * clientsPageSize + index + 1}</TableCell>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(client.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              currentPage={clientsPage}
              pageSize={clientsPageSize}
              totalItems={metrics.topClients.length}
              onPageChange={setClientsPage}
              onPageSizeChange={setClientsPageSize}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
