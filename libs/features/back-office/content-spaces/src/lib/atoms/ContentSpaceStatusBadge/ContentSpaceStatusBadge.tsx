import { ContentSpaceStatus_Enum } from '@gql/shared/types';
import { Badge, BadgeProps } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface ContentSpaceStatusBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children' | 'title' | 'icon'> {
  status: ContentSpaceStatus_Enum | null | undefined;
}

export function ContentSpaceStatusBadge({
  status,
  className,
  ...props
}: ContentSpaceStatusBadgeProps) {
  const t = useTranslations('OrganizerContentSpaces.ContentSpaceStatusBadge');
  const texts = {
    [ContentSpaceStatus_Enum.Draft]: t('status-draft'),
    [ContentSpaceStatus_Enum.Published]: t('status-published'),
  };
  const classes = {
    [ContentSpaceStatus_Enum.Draft]: 'text-warning border-warning',
    [ContentSpaceStatus_Enum.Published]: 'text-success border-success',
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
