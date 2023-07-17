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

export type UserCartProps = LocalPassListProps;

export const UserCart: React.FC<UserCartProps> = ({ EventPassesFetcher }) => {
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
            <LocalPassList EventPassesFetcher={EventPassesFetcher} />
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
