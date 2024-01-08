import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { Badge, BadgeProps, PopoverInfo } from '@ui/components';
import { InfoAvailable, InfoSealed } from '@ui/icons';
import {
  backgroundColors,
  backgroundHoverColors,
  textColors,
} from '@ui/shared';
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
    [EventPassNftContractType_Enum.Normal]: `${textColors.green} ${backgroundColors.green} ${backgroundHoverColors.green}`,
    [EventPassNftContractType_Enum.DelayedReveal]: `${textColors.blue} ${backgroundColors.blue} ${backgroundHoverColors.blue}`,
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
