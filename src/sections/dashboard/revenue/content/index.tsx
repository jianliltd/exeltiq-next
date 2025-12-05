'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { AllHistory } from './transaction-history';
import { TopClients } from './top-clients';

import useTranslate from '@/hook/use-translate';

import { RevenueMetrics, RevenueRecord } from '../type';

interface TransactionHistoryProps {
  revenue: RevenueRecord[];
  metrics: RevenueMetrics;
  formatCurrency: (amount: number) => string;
}

export const TransactionHistory = ({ revenue, metrics, formatCurrency }: TransactionHistoryProps) => {
  const { t } = useTranslate();

  return (
    <Tabs defaultValue="all" className="space-y-4 w-full">
      <TabsList>
        <TabsTrigger value="all">{t('revenue.allTransactions')}</TabsTrigger>
        <TabsTrigger value="clients">{t('revenue.topClients')}</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <AllHistory revenue={revenue} formatCurrency={formatCurrency} />
      </TabsContent>
      <TabsContent value="clients">
        <TopClients metrics={metrics} formatCurrency={formatCurrency} />
      </TabsContent>
    </Tabs>
  );
};
