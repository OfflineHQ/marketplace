import { Text } from '@ui/components';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Index');
  return (
    <div className="p-8">
      <Text>{t('title')}</Text>
      Network: {process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK}
    </div>
  );
}
