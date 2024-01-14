import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import { AllPassesCart, UserPassOrder } from '@features/cart-types';
import { Link } from '@next/navigation';
import {
  Alert,
  Button,
  CardContent,
  CardHeader,
  CardTitle,
  AlertTitle,
  AlertDescription,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { EventPassList } from '../EventPassList/EventPassList';

export type CartCancelledProps = {
  passes: UserPassOrder[];
};

export const CartCancelled: FC<CartCancelledProps> = ({ passes }) => {
  const t = useTranslations('Cart.Cancelled');
  const allPasses: AllPassesCart = passes?.reduce((acc, pass) => {
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
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold tracking-tighter text-warning md:text-3xl">
            {t('title')}
          </CardTitle>
          <Alert variant="warning" className="max-w-[600px]">
            <AlertTitle>{t('cancelled-title')}</AlertTitle>
            <AlertDescription>{t('description')}</AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <EventPassList allPasses={allPasses} noActions={true} />
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>
        <Link href="/" legacyBehavior>
          <Button variant="secondary">{t('continue-shopping-button')}</Button>
        </Link>
      </AppContainerFooter>
    </AppContainer>
  );
};
