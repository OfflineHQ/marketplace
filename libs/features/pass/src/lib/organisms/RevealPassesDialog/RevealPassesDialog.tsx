import { NextIntlClientProvider, useLocale } from 'next-intl';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@next/i18n';
import {
  RevealPassesDialogClient,
  type RevealPassesDialogClientProps,
} from './RevealPassesDialogClient';

export type RevealPassesDialogProps = RevealPassesDialogClientProps;

export const RevealPassesDialog: React.FC<RevealPassesDialogProps> = (
  props,
) => {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Pass.UserPass.UserPassEventCard',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <RevealPassesDialogClient {...props} />
    </NextIntlClientProvider>
  );
};
