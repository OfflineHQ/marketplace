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
} from '@ui/components';
import { NoUserCartFooterClient } from './NoUserCartFooterClient';
import {
  LocalPassList,
  type LocalPassListProps,
} from '../LocalPassList/LocalPassList';

export type NoUserCartProps = LocalPassListProps;

export const NoUserCart: React.FC<NoUserCartProps> = (props) => {
  const t = useTranslations('Cart.NoUserCart');
  // getLocalCart();
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className="px-1">
            <LocalPassList {...props} />
          </CardContent>
        </CardOverflow>
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <NoUserCartFooterClient signInText={t('sign-in-text')} />
        </CardFooter>
      </Card>
    </section>
  );
};
