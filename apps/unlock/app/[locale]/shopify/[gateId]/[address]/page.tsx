import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';
import dynamic from 'next/dynamic';

interface GateProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

const OffKeyGate = dynamic(
  async () => (await import('@features/unlock/shopify')).OffKeyGate,
  { ssr: false },
);

export default function Gate({
  params: { locale, gateId, address },
}: GateProps) {
  const localeMessages = deepPick(messages[locale], [
    'Shopify.OffKeyGate',
    'Shopify.OffKeyInfo',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <OffKeyGate className="flex-1 pt-2" gateId={gateId} address={address} />
    </NextIntlClientProvider>
  );
}
