import { UserPassOrder } from '@features/cart-types';
import { Link } from '@next/navigation';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardOverlay,
  CardTitle,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { EventPassList } from '../EventPassList/EventPassList';

export type CartSuccessfulProps = {
  passes: UserPassOrder[];
};

export const CartSuccessful: FC<CartSuccessfulProps> = ({ passes }) => {
  const t = useTranslations('Cart.Successful');
  const allPasses = passes?.reduce((acc, pass) => {
    const organizerSlug = pass.eventPass?.event?.organizer?.slug;
    const eventSlug = pass.eventPass?.event?.slug;
    if (organizerSlug && eventSlug) {
      if (!acc[organizerSlug]) {
        acc[organizerSlug] = {};
      }
      if (!acc[organizerSlug][eventSlug]) {
        acc[organizerSlug][eventSlug] = [];
      }
      acc[organizerSlug][eventSlug].push(pass);
    }
    return acc;
  }, {} as any);
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl font-bold tracking-tighter text-success md:text-3xl">
              {t('title')}
            </CardTitle>
            <Alert variant="success" className="max-w-[600px]">
              {t('description')}
            </Alert>
          </CardHeader>
          <CardContent>
            <EventPassList allPasses={allPasses} noActions={true} />
          </CardContent>
        </CardOverflow>
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <Link href="/" legacyBehavior>
            <Button variant="secondary">{t('continue-shopping-button')}</Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
