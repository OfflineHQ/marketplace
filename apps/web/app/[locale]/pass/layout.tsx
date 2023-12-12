import { getEventPassOrdersIsMinting } from '@features/cart-api';
import { NoUserPass, UserPass } from '@features/pass';
import { getCurrentUser } from '@next/next-auth/user';
import { useTranslations } from 'next-intl';

export interface PassLayoutProps {
  children: React.ReactNode;
}

export default async function PassLayout(props: PassLayoutProps) {
  const user = await getCurrentUser();

  let numMintingOrders = 0;
  if (user) {
    const userPassMintingOrders = await getEventPassOrdersIsMinting();
    if (userPassMintingOrders?.length) {
      numMintingOrders = userPassMintingOrders.reduce(
        (sum, order) => sum + order.quantity,
        0,
      );
    }
  }
  return (
    <PassLayoutContent
      {...props}
      getUser={!!user}
      numMintingOrders={numMintingOrders}
    />
  );
}

interface PassLayoutContentProps extends PassLayoutProps {
  getUser: boolean;
  numMintingOrders: number;
}

function PassLayoutContent({
  children,
  getUser,
  numMintingOrders,
}: PassLayoutContentProps) {
  const t = useTranslations('Pass.NoUserPass');
  const tUserPass = useTranslations('Pass.UserPass');
  const textMintingOrdersBadge = numMintingOrders
    ? tUserPass('minting-success-message-badge', {
        numPass: numMintingOrders,
      })
    : '';
  return getUser ? (
    <UserPass
      title={tUserPass('title')}
      comingSoon={tUserPass('upcoming')}
      past={tUserPass('past')}
      textMintingOrdersBadge={textMintingOrdersBadge}
    >
      {children}
    </UserPass>
  ) : (
    <NoUserPass
      title={t('title')}
      description={t('description')}
      signInText={t('sign-in-text')}
      noPassImage={'/empty-pass.svg'}
    >
      {children}
    </NoUserPass>
  );
}
