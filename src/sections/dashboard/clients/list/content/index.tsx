'use client';

import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

import { GridView } from './grid-bar';
import { ListView } from './list-bar';

import { Pagination } from '@/components/pagination';

import useTranslate from '@/hook/use-translate';

import { Client } from '../../type';

interface ClientsContentProps {
  isLoading: boolean;
  searchTerm: string;
  viewMode: 'grid' | 'list';
  filteredClients: Client[];
  paginatedClients: Client[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ClientsContent = ({
  isLoading,
  searchTerm,
  viewMode,
  filteredClients,
  paginatedClients,
  currentPage,
  totalPages,
  onPageChange,
}: ClientsContentProps) => {
  const { t } = useTranslate();
  const router = useRouter();

  const handleClientClick = (clientId: string) => {
    router.push(`/dashboard/clients/view-detail/${clientId}`);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[280px] w-full" />
        ))}
      </div>
    );
  }

  if (filteredClients.length === 0) {
    return (
      <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchTerm ? t('clients.noClientsFound') : t('clients.noClientsYet')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <GridView clients={paginatedClients} onClientClick={handleClientClick} />
      ) : (
        <ListView clients={paginatedClients} onClientClick={handleClientClick} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ClientsContent;

