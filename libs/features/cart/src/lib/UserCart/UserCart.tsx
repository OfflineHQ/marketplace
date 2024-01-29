import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  reason?: string;
}

export const UserCart: React.FC<UserCartProps> = ({
  children,
  ...eventPassesCartProps
}) => {
  const t = useTranslations('Cart.UserCart');
  const reason = eventPassesCartProps.reason;

  return (
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        {reason ? (
          <div className="mx-2 mb-5 flex w-full max-w-[600px] flex-col items-center px-2 pr-7 sm:px-5 md:mx-5">
            <Alert variant="warning">
              <AlertTitle>{t('no-mail-title')}</AlertTitle>
              <AlertDescription>{t('no-mail-description')}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <></>
        )}
        <CardContent className="mx-5 px-1">
          <EventPassesCart {...eventPassesCartProps} />
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>{children}</AppContainerFooter>
    </AppContainer>
  );
};
