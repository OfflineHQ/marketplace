import { useTranslations } from 'next-intl';
import { OffKeyHeader, OffKeyHeaderProps } from '../OffKeyHeader/OffKeyHeader';
import { OffKeyViewHeaderConnected } from '../types';

export interface OffKeyHeaderConnectedProps
  extends Required<Pick<OffKeyHeaderProps, 'profile'>> {
  viewType: OffKeyViewHeaderConnected;
}

export const OffKeyHeaderConnected: React.FC<OffKeyHeaderConnectedProps> = ({
  profile,
  viewType,
}) => {
  const t = useTranslations('Shopify.OffKeyHeaderConnected');
  const viewTypeToText = {
    [OffKeyViewHeaderConnected.Default]: t('connected'),
    [OffKeyViewHeaderConnected.HowToGet]: t('connected-how-to-get-key'),
  };
  return <OffKeyHeader profile={profile} title={viewTypeToText[viewType]} />;
};
