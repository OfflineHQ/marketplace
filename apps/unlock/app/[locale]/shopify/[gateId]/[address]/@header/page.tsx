import {
  OffKeyHeaderConnected,
  OffKeyProfile,
  OffKeyViewHeaderConnected,
} from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';

interface HeaderProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

export default function Header({
  params: { locale, gateId, address },
}: HeaderProps) {
  const localeMessages = deepPick(messages[locale], ['Shopify.OffKeyProfile']);
  return (
    <OffKeyHeaderConnected
      viewType={OffKeyViewHeaderConnected.Default}
      profile={
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <OffKeyProfile user={{ id: '', address }} />
        </NextIntlClientProvider>
      }
    />
  );
}
