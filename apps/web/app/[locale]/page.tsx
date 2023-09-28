import { Text } from '@ui/components';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Index');
  return (
    <div className="p-8">
      <Text>{t('title')}</Text>
    </div>
  );
}
