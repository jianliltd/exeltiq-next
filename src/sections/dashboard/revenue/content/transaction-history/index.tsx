'use client';
import { useState } from 'react';

import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

import { Pagination } from '../pagination';

import { RevenueRecord } from '../../type';

import useTranslate from '@/hook/use-translate';

interface AllHistoryProps {
  revenue: RevenueRecord[];
  formatCurrency: (amount: number) => string;
}

export const AllHistory = ({ revenue, formatCurrency }: AllHistoryProps) => {
  const { t } = useTranslate();
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPageSize, setTransactionsPageSize] = useState(10);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('revenue.transactionHistory')}</CardTitle>
      </CardHeader>
      <CardContent>
        {revenue.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {t('revenue.noRevenueData')}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('revenue.date')}</TableHead>
                    <TableHead>{t('revenue.client')}</TableHead>
                    <TableHead>{t('revenue.package')}</TableHead>
                    <TableHead>{t('revenue.paymentType')}</TableHead>
                    <TableHead className="text-right">{t('revenue.amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenue
                    .slice((transactionsPage - 1) * transactionsPageSize, transactionsPage * transactionsPageSize)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {format(new Date(record.created_at), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{record.clients?.name || "Unknown"}</TableCell>
                        <TableCell>{record.package_type}</TableCell>
                        <TableCell className="capitalize">{record.payment_type}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(record.amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              currentPage={transactionsPage}
              pageSize={transactionsPageSize}
              totalItems={revenue.length}
              onPageChange={setTransactionsPage}
              onPageSizeChange={setTransactionsPageSize}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
