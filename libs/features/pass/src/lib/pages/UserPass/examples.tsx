import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { Toaster } from '@ui/components';
import { useTranslations } from 'next-intl';
import { UserPass } from './UserPass';

export function UserPassExample({
  children,
  numMintingOrders,
}: {
  children: React.ReactNode;
  numMintingOrders?: number;
}) {
  const t = useTranslations('Pass.UserPass');
  const textMintingOrdersBadge = numMintingOrders
    ? t('minting-success-message-badge', {
        numPass: numMintingOrders,
      })
    : '';
  return (
    <>
      <AppNavLayout
        {...WithNormalUser.args}
        children={
          <UserPass
            title={t('title')}
            comingSoon={t('upcoming')}
            past={t('past')}
            children={children}
            textMintingOrdersBadge={textMintingOrdersBadge}
          />
        }
      />
      <Toaster />
    </>
  );
}
