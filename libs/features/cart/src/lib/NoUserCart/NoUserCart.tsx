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
import { NoUserCartFooterClient } from './NoUserCartFooterClient';

export type NoUserCartProps = EventPassesCartProps;

export const NoUserCart: React.FC<NoUserCartProps> = (props) => {
  const t = useTranslations('Cart.NoUserCart');
  return (
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="mx-5 px-1">
          <EventPassesCart {...props} />
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>
        <NoUserCartFooterClient signInText={t('sign-in-text')} />
      </AppContainerFooter>
    </AppContainer>
  );
};
