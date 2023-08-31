import { useTranslations } from 'next-intl';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
  CardOverlay,
  CardDescription,
  Button,
} from '@ui/components';
import {
  LocalPassList,
  type LocalPassListProps,
} from '../LocalPassList/LocalPassList';
import { getEventPassPendingOrders } from '../api/getEventPassPendingOrders';

export interface UserCartProps extends LocalPassListProps {
  locale: string;
}

export async function UserCart({
  EventPassesFetcher,
  locale,
  noCartImage,
}: UserCartProps) {
  const userPassPendingOrders = await getEventPassPendingOrders({ locale });
  return (
    <UserCartSection
      EventPassesFetcher={EventPassesFetcher}
      userPassPendingOrders={userPassPendingOrders}
      noCartImage={noCartImage}
    />
  );
}

type UserCartSectionProps = LocalPassListProps;

const UserCartSection: React.FC<UserCartSectionProps> = ({
  EventPassesFetcher,
  userPassPendingOrders,
  noCartImage,
}) => {
  const t = useTranslations('Cart.UserCart');
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className="px-1">
            <LocalPassList
              EventPassesFetcher={EventPassesFetcher}
              userPassPendingOrders={userPassPendingOrders}
              noCartImage={noCartImage}
            />
          </CardContent>
        </CardOverflow>
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <Button>{t('finalize-button')}</Button>
        </CardFooter>
      </Card>
    </section>
  );
};
