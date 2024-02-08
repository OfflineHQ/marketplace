import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import { AllPassesCart, UserPassOrder } from '@features/cart-types';
import { CancelPurchaseButton } from '@features/organizer/event';
import { messages } from '@next/i18n';
import { Link } from '@next/navigation';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { type Locale } from '@next/i18n';
import { FC } from 'react';
import { EventPassList } from '../EventPassList/EventPassList';

export type CartCancelledProps = {
  passes: UserPassOrder[];
};

export const CartCancelled: FC<CartCancelledProps> = ({ passes }) => {
  const t = useTranslations('Cart.Cancelled');
  const locale = useLocale() as Locale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.PassPurchaseHeader',
  ]);

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
            <NextIntlClientProvider locale={locale} messages={localeMessages}>
              <CancelPurchaseButton />
            </NextIntlClientProvider>
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
