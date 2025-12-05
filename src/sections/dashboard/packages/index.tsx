import useTranslate from '@/hook/use-translate';
import { PackagesHeader } from './header';
import { PackagesContent } from './content';

export const PackagesView = () => {
  const { t } = useTranslate();

  return (
    <div>
      <div>
        <PackagesHeader />
        <PackagesContent />
      </div>
    </div>
  );
}
