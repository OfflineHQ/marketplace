import { useTranslations } from 'next-intl';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
  Button,
  ButtonSkeleton,
  CardOverlay,
  Text,
  CardDescription,
} from '@ui/components';
import { NoUserPassFooterClient } from './NoUserPassFooterClient';

export const NoUserPass: React.FC = () => {
  const t = useTranslations('Pass.NoUserPass');
  // getLocalCart();
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO add image or animation if cart is empty */}
            {/* or LocalCartContent component */}
          </CardContent>
        </CardOverflow>
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <NoUserPassFooterClient signInText={t('sign-in-text')} />
        </CardFooter>
      </Card>
    </section>
  );
};
