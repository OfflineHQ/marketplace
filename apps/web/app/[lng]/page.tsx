import Link from 'next/link';
import { useTranslation } from '../i18n';
import Footer from './components/Footer';
import { Button, Text } from '@ui/components';

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <Text variant="h1">Hi there!</Text>
      <Link href={`/${lng}/second-page`}> {t('to-second-page')}</Link>
      <Link href={`/${lng}/client-page`}>{t('to-client-page')}</Link>
      <Button>Server Button</Button>
      <Footer lng={lng} />
    </>
  );
}
