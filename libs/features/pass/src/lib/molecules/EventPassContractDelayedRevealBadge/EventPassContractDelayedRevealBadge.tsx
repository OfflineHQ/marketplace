import { EventWithEventPassNfts } from '@features/pass-types';
import { Badge, BadgeProps, PopoverInfo } from '@ui/components';
import { InfoSealed } from '@ui/icons';
import {
  backgroundColors,
  backgroundHoverColors,
  textColors,
} from '@ui/shared';
import { useTranslations } from 'next-intl';

export interface EventPassContractDelayedRevealBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children' | 'title' | 'icon'>,
    Pick<
      EventWithEventPassNfts['eventPassNftContracts'][0],
      'isDelayedRevealed'
    > {}

export function EventPassContractDelayedRevealBadge({
  isDelayedRevealed,
  className,
  ...props
}: EventPassContractDelayedRevealBadgeProps) {
  const t = useTranslations(
    'Pass.UserPass.EventPassContractDelayedRevealBadge',
  );
  const texts = {
    true: t('revealed-title'),
    false: t('not-revealed-title'),
  };
  const descriptions = {
    true: t('revealed-description'),
    false: t('not-revealed-description'),
  };
  const classes = {
    true: `${textColors.green} ${backgroundColors.green} ${backgroundHoverColors.green}`,
    false: `${textColors.blue} ${backgroundColors.blue} ${backgroundHoverColors.blue}`,
  };
  const type = isDelayedRevealed ? 'true' : 'false';
  return (
    <PopoverInfo title={texts[type]} description={descriptions[type]}>
      <Badge
        {...props}
        className={`${classes[type]} ${className}`}
        icon={<InfoSealed />}
      >
        {texts[type]}
      </Badge>
    </PopoverInfo>
  );
}
