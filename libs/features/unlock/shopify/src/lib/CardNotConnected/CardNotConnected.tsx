import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { useLocale } from 'next-intl';
import { ShopifyCard, ShopifyCardProps } from '../Card/Card';
import { ShopifyCardHeader } from '../CardHeader/CardHeader';
import { ShopifyProfileNavProps } from '../ProfileNav/ProfileNav';

export interface ShopifyCardNotConnectedProps
  extends ShopifyProfileNavProps,
    Pick<ShopifyCardProps, 'children' | 'footer'> {}

export function ShopifyCardNotConnected({
  footer,
  children,
  ...profileProps
}: ShopifyCardNotConnectedProps) {
  const locale = useLocale();
  const localeMessages = deepPick(messages[locale as Locale], [
    'Shopify.Profile',
  ]);
  return (
    <ShopifyCard footer={footer} header={<ShopifyCardHeader />}>
      {children}
    </ShopifyCard>
  );
}
