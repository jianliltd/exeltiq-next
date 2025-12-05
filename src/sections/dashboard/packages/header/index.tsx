import useTranslate from '@/hook/use-translate';
import { PackagesContent } from '../content';



export const PackagesHeader = () => {
  const { t } = useTranslate();
  return (
    <div>
      <div className="min-h-screen bg-background">
        <PackagesContent />
      </div>
    </div>
  );
};