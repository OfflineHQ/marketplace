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
import { NoUserCartFooterClient } from './NoUserCartFooterClient';

export type NoUserCartProps = LocalPassListProps;

export const NoUserCart: React.FC<NoUserCartProps> = ({ noCartImage }) => {
  const t = useTranslations('Cart.NoUserCart');
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className="px-1">
            <LocalPassList noCartImage={noCartImage} />
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
