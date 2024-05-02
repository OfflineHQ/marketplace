import { SaleStatus } from '@features/organizer/event-types';
import { Badge, BadgeProps } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface PassCardStatusBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children' | 'title' | 'icon'> {
  saleStatus?: SaleStatus;
  hasConfirmedPasses?: boolean;
  isSoldOut?: boolean;
}

export const PassCardStatusBadge: React.FC<PassCardStatusBadgeProps> = (
  props,
) => {
  const { saleStatus, hasConfirmedPasses, isSoldOut } = props;
  const t = useTranslations('Organizer.Event.PassPurchase.PassCardStatusBadge');

  if (saleStatus === SaleStatus.NotStarted) {
    return <Badge variant="info">{t('sale-starting-in')}</Badge>;
  }

  if (saleStatus === SaleStatus.Ended) {
    return <Badge variant="info">{t('sale-ended')}</Badge>;
  }

  if (isSoldOut) {
    return <Badge variant="warning">{t('sold-out')}</Badge>;
  }

  if (hasConfirmedPasses) {
    return <Badge variant="warning">{t('already-have-purchase')}</Badge>;
  }

  return null;
};
