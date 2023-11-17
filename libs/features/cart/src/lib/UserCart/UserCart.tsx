import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardTitle,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  EventPassesCart,
  type EventPassesCartProps,
} from '../EventPassesCart/EventPassesCart';

export interface UserCartProps extends EventPassesCartProps {
  children: React.ReactNode;
}

export const UserCart: React.FC<UserCartProps> = ({
  userPassPendingOrders,
  noCartImage,
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
            <EventPassesCart
              userPassPendingOrders={userPassPendingOrders}
              noCartImage={noCartImage}
            />
          </CardContent>
        </CardOverflow>
        <CardFooter className="justify-center" variant="sticky">
          {children}
        </CardFooter>
      </Card>
    </section>
  );
};
