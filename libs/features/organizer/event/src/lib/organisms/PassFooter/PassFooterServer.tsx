import { NextIntlClientProvider, useLocale } from 'next-intl';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@next/i18n';

export type PassFooterServerProps = {
  children: React.ReactNode;
};
export const PassFooterServer: React.FC<PassFooterServerProps> = ({
  children,
}) => {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.PassPurchase.Footer',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      {children}
    </NextIntlClientProvider>
  );
};
