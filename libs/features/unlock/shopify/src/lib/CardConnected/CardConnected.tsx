import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { ShopifyCard, ShopifyCardProps } from '../Card/Card';
import { ShopifyCardHeader } from '../CardHeader/CardHeader';
import {
  ShopifyProfileNav,
  ShopifyProfileNavProps,
} from '../ProfileNav/ProfileNav';

export interface ShopifyCardConnectedProps
  extends ShopifyProfileNavProps,
    Pick<ShopifyCardProps, 'children' | 'footer'> {}

export function ShopifyCardConnected({
  footer,
  children,
  ...profileProps
}: ShopifyCardConnectedProps) {
  const locale = useLocale();
  const localeMessages = deepPick(messages[locale as Locale], [
    'Shopify.Profile',
  ]);
  return (
    <ShopifyCard
      footer={footer}
      header={
        <ShopifyCardHeader
          profile={
            <NextIntlClientProvider locale={locale} messages={localeMessages}>
              <ShopifyProfileNav {...profileProps} />
            </NextIntlClientProvider>
          }
        />
      }
    >
      {children}
    </ShopifyCard>
  );
}
