import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import { Locale, defaultLocale, messages } from '@next/i18n';
import { Link } from '@next/navigation';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CardDescription,
  SheetDescription,
} from '@ui/components';
import { Cart } from '@ui/icons';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { PassListProps } from '../../organisms/PassList/PassList';
import { SaleEndsInClient } from './SaleEndsInClient';
import { SaleStartsInClient } from './SaleStartsInClient';

export interface PassPurchaseHeaderProps
  extends Pick<PassListProps, 'hasConfirmedPasses' | 'saleStatus'> {
  eventParameters: EventParametersPasses;
  isCard?: boolean;
}

const SaleNotStartedAlert = ({
  eventParameters,
}: {
  eventParameters: EventParametersPasses;
}) => {
  const t = useTranslations('Organizer.Event.PassPurchaseHeader');
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.SaleStartsInClient',
  ]);
  return (
    <Alert variant="info" className="md:max-w-xl">
      <AlertTitle>{t('not-started-title')}</AlertTitle>
      <AlertDescription>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <SaleStartsInClient {...eventParameters} />
        </NextIntlClientProvider>
      </AlertDescription>
    </Alert>
  );
};
const SaleEndedAlert = () => {
  const t = useTranslations('Organizer.Event.PassPurchaseHeader');
  return (
    <Alert variant="info" className="md:max-w-xl">
      <AlertTitle>{t('ended-title')}</AlertTitle>
      <AlertDescription>{t('ended-description')}</AlertDescription>
    </Alert>
  );
};

const OngoingSaleDescriptionAndBadge = ({
  isCard,
  eventParameters,
}: {
  isCard: boolean;
  eventParameters: EventParametersPasses;
}) => {
  const t = useTranslations('Organizer.Event.PassPurchaseHeader');
  const description = isCard ? (
    <CardDescription>{t('description')}</CardDescription>
  ) : (
    <SheetDescription>{t('description')}</SheetDescription>
  );

  return (
    <>
      {description}
      <SaleEndsInClient {...eventParameters} />
    </>
  );
};

const PurchaseInProgressAlert = () => {
  const t = useTranslations('Organizer.Event.PassPurchaseHeader');
  return (
    <Alert variant="warning" className="md:max-w-xl">
      <AlertTitle>{t('has-purchase-in-progress-title')}</AlertTitle>
      <AlertDescription>
        {t('has-purchase-in-progress-description')}
      </AlertDescription>
      <Link
        href="/cart"
        legacyBehavior
        passHref
        className="w-full justify-center"
      >
        <Button variant="link" className="mt-1 px-0" icon={<Cart />}>
          {t('go-to-purchase')}
        </Button>
      </Link>
    </Alert>
  );
};

export const PassPurchaseHeader: React.FC<PassPurchaseHeaderProps> = ({
  hasConfirmedPasses,
  saleStatus,
  eventParameters,
  isCard = false,
}) => {
  if (hasConfirmedPasses) {
    return <PurchaseInProgressAlert />;
  }

  switch (saleStatus) {
    case SaleStatus.NotStarted:
      return <SaleNotStartedAlert eventParameters={eventParameters} />;
    case SaleStatus.Ended:
      return <SaleEndedAlert />;
    case SaleStatus.Ongoing:
      return (
        <OngoingSaleDescriptionAndBadge
          isCard={isCard}
          eventParameters={eventParameters}
        />
      );
    default:
      return null; // or some default case if needed
  }
};
