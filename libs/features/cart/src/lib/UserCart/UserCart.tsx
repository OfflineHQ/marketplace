import { Locale } from '@gql/shared/types';
import { AppUser } from '@next/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardOverlay,
  CardTitle,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  LocalPassList,
  type LocalPassListProps,
} from '../LocalPassList/LocalPassList';
import { getEventPassPendingOrders } from '../api/getEventPassPendingOrders';

export interface UserCartProps extends LocalPassListProps {
  locale: Locale;
  user: AppUser;
  children: React.ReactNode;
}

export async function UserCart({
  EventPassesFetcher,
  locale,
  noCartImage,
  user,
  children,
}: UserCartProps) {
  const userPassPendingOrders = await getEventPassPendingOrders({ locale });
  return (
    <UserCartSection
      EventPassesFetcher={EventPassesFetcher}
      userPassPendingOrders={userPassPendingOrders}
      noCartImage={noCartImage}
      user={user}
      locale={locale}
      children={children}
    />
  );
}

type UserCartSectionProps = UserCartProps;

const UserCartSection: React.FC<UserCartSectionProps> = ({
  EventPassesFetcher,
  userPassPendingOrders,
  noCartImage,
  user,
  locale,
  children,
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
          {children}
        </CardFooter>
      </Card>
    </section>
  );
};
