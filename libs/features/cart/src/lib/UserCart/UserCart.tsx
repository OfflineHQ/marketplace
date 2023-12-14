import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import {
  CardContent,
  CardDescription,
  CardHeader,
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
  getAllPassesCart,
  children,
}) => {
  const t = useTranslations('Cart.UserCart');
  return (
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="px-1">
          <EventPassesCart
            userPassPendingOrders={userPassPendingOrders}
            noCartImage={noCartImage}
            getAllPassesCart={getAllPassesCart}
          />
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>{children}</AppContainerFooter>
    </AppContainer>
  );
};
