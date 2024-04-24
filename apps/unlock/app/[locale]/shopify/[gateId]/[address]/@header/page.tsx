import { OffKeyViewHeaderConnected } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';
import dynamic from 'next/dynamic';

interface HeaderProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

const OffKeyProfile = dynamic(
  () => import('@features/unlock/shopify').then((mod) => mod.OffKeyProfile),
  { ssr: false },
);
const OffKeyHeaderConnected = dynamic(
  () =>
    import('@features/unlock/shopify').then((mod) => mod.OffKeyHeaderConnected),
  { ssr: false },
);

export default function Header({
  params: { locale, gateId, address },
}: HeaderProps) {
  const localeMessages = deepPick(messages[locale], [
    'Shopify.OffKeyProfile',
    'Shopify.OffKeyHeaderConnected',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <OffKeyHeaderConnected
        viewType={OffKeyViewHeaderConnected.Default}
        profile={<OffKeyProfile user={{ id: '', address }} />}
      />
    </NextIntlClientProvider>
  );
}
