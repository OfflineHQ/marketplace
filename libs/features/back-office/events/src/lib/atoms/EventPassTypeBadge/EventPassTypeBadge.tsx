import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { Badge, BadgeProps, PopoverInfo } from '@ui/components';
import { InfoAvailable, InfoSealed } from '@ui/icons';
import { useTranslations } from 'next-intl';

export interface EventPassTypeBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children' | 'title' | 'icon'> {
  type: EventPassNftContractType_Enum;
}

export function EventPassTypeBadge({
  type,
  className,
  ...props
}: EventPassTypeBadgeProps) {
  const t = useTranslations('OrganizerEvents.EventPassTypeBadge');
  const texts = {
    [EventPassNftContractType_Enum.Normal]: t('type-normal-badge'),
    [EventPassNftContractType_Enum.DelayedReveal]: t(
      'type-delayed-reveal-badge',
    ),
  };
  const descriptions = {
    [EventPassNftContractType_Enum.Normal]: t('type-normal-description'),
    [EventPassNftContractType_Enum.DelayedReveal]: t(
      'type-delayed-reveal-description',
    ),
  };
  const classes = {
    [EventPassNftContractType_Enum.Normal]:
      'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800',
    [EventPassNftContractType_Enum.DelayedReveal]:
      'bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800',
  };
  const icons = {
    [EventPassNftContractType_Enum.Normal]: <InfoAvailable />,
    [EventPassNftContractType_Enum.DelayedReveal]: <InfoSealed />,
  };
  if (!type) return null;
  return (
    <PopoverInfo title={texts[type]} description={descriptions[type]}>
      <Badge
        {...props}
        className={`${classes[type]} ${className}`}
        icon={icons[type]}
      >
        {texts[type]}
      </Badge>
    </PopoverInfo>
  );
}
