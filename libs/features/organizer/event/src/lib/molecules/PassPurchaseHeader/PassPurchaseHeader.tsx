import { SaleStatus } from '@features/organizer/event-types';
import {
  SheetDescription,
  CardDescription,
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
} from '@ui/components';
import { Cart } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { PassListProps } from '../../organisms/PassList/PassList';
import { Link } from '@next/navigation';

export interface PassPurchaseHeaderProps
  extends Pick<PassListProps, 'hasConfirmedPasses' | 'saleStatus'> {
  isCard?: boolean;
}

export const PassPurchaseHeader: React.FC<PassPurchaseHeaderProps> = ({
  hasConfirmedPasses,
  saleStatus,
  isCard = false,
}) => {
  const t = useTranslations('Organizer.Event.PassPurchaseHeader');
  return (
    <>
      {!hasConfirmedPasses &&
        saleStatus === SaleStatus.Ongoing &&
        (isCard ? (
          <CardDescription>{t('description')}</CardDescription>
        ) : (
          <SheetDescription>{t('description')}</SheetDescription>
        ))}
      {hasConfirmedPasses && (
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
      )}
    </>
  );
};
