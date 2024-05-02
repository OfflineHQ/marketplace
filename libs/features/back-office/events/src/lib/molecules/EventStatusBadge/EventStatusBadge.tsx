import { EventStatus_Enum } from '@gql/shared/types';
import { Badge, BadgeProps } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface EventStatusBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children' | 'title' | 'icon'> {
  status: EventStatus_Enum | null | undefined;
}

export function EventStatusBadge({
  status,
  className,
  ...props
}: EventStatusBadgeProps) {
  const t = useTranslations('OrganizerEvents.EventStatusBadge');
  const texts = {
    [EventStatus_Enum.Draft]: t('status-draft'),
    [EventStatus_Enum.Published]: t('status-published'),
  };
  const classes = {
    [EventStatus_Enum.Draft]: 'text-warning border-warning',
    [EventStatus_Enum.Published]: 'text-success border-success',
  };
  return (
    <Badge
      {...props}
      variant="outline"
      className={`${status && classes[status]} ${className} rounded-xl`}
    >
      {status ? texts[status] : t('status-undefined')}
    </Badge>
  );
}
