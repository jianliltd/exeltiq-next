'use client';

import { Button } from '@/components/ui/button';

import { Plus, Upload } from 'lucide-react';

import useTranslate from '@/hook/use-translate';

interface ClientsHeaderProps {
  onImportClick: () => void;
  onAddClick: () => void;
}

export const ClientsHeader = ({ onImportClick, onAddClick }: ClientsHeaderProps) => {
  const { t } = useTranslate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('clients.title')}</h1>
          <p className="text-muted-foreground">{t('clients.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            {t('clients.importCSV')}
          </Button>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            {t('clients.addClient')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientsHeader;

