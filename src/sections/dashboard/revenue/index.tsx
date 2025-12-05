import { useState } from 'react';

import MetricCard from '@/components/dashboard/metric-card';

import { Euro } from 'lucide-react';

import { RevenueMetrics, RevenueRecord } from './type';
import { mockRevenue, mockMetrics } from './mock';
import { TransactionHistory } from './content';

import useTranslate from '@/hook/use-translate';

export const RevenuseView = () => {
  const { t } = useTranslate();
  const [revenue, setRevenue] = useState<RevenueRecord[]>(mockRevenue);
  const [metrics, setMetrics] = useState<RevenueMetrics>(mockMetrics);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('revenue.title')}</h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('revenue.dailyRevenue')}
          value={formatCurrency(metrics.daily)}
          icon={Euro}
          iconColor="bg-gradient-primary"
        />
          <MetricCard
            title={t('revenue.monthlyRevenue')}
            value={formatCurrency(metrics.monthly)}
            icon={Euro}
            iconColor="bg-gradient-primary"
          />
          <MetricCard
            title={t('revenue.yearlyRevenue')}
            value={formatCurrency(metrics.yearly)}
            icon={Euro}
            iconColor="bg-gradient-primary"
          />
          <MetricCard
            title={t('revenue.totalRevenue')}
            value={formatCurrency(metrics.total)}
            icon={Euro}
            iconColor="bg-gradient-primary"
          />
      </div>

      <TransactionHistory revenue={revenue} metrics={metrics} formatCurrency={formatCurrency} /> 
    </div>
  );
}
