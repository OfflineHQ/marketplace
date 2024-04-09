import { OffKeyGate, OffKeyState } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';

interface GateProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

export default function Gate({
  params: { locale, gateId, address },
}: GateProps) {
  const localeMessages = deepPick(messages[locale], [
    'Shopify.OffKeyGate',
    'Shopify.OffKeyInfo',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <OffKeyGate
        className="flex-1 pt-2"
        gateId={gateId}
        address={address}
        initialGateState={OffKeyState.Unlocked}
      />
    </NextIntlClientProvider>
  );
}
