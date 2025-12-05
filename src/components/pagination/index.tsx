'use client';

import { Button } from '@/components/ui/button';
import useTranslate from '@/hook/use-translate';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { t } = useTranslate();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-full sm:w-auto min-h-[44px] sm:min-h-0"
      >
        {t('common.previous')}
      </Button>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-0 sm:w-9"
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto min-h-[44px] sm:min-h-0"
      >
        {t('common.next')}
      </Button>
    </div>
  );
};

export default Pagination;

