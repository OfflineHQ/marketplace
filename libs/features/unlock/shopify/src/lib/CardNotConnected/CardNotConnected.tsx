import { ShopifyAuth } from '../Auth/Auth';
import { ShopifyCard, ShopifyCardProps } from '../Card/Card';
import { ShopifyCardHeader } from '../CardHeader/CardHeader';
import { ShopifyProfileNavProps } from '../ProfileNav/ProfileNav';

export interface ShopifyCardNotConnectedProps
  extends ShopifyProfileNavProps,
    Pick<ShopifyCardProps, 'children'> {}

export function ShopifyCardNotConnected({
  children,
}: ShopifyCardNotConnectedProps) {
  return (
    <ShopifyCard footer={<ShopifyAuth />} header={<ShopifyCardHeader />}>
      {children}
    </ShopifyCard>
  );
}
