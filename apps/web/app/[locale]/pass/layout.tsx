import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { UserPass, NoUserPass } from '@features/pass';
import { getCurrentUser } from '@next/next-auth/user';

interface PassLayoutProps {
  children: ReactNode;
  past: ReactNode;
  getUser?: boolean;
}

export default async function PassLayout(props: PassLayoutProps) {
  const user = await getCurrentUser();
  return <PassLayoutContent {...props} getUser={!!user} />;
}

function PassLayoutContent({ children, past, getUser }: PassLayoutProps) {
  const t = useTranslations('Pass.NoUserPass');
  const tUserPass = useTranslations('Pass.UserPass');
  return getUser ? (
    <UserPass
      title={tUserPass('title')}
      comingSoon={tUserPass('upcoming')}
      past={tUserPass('past')}
    >
      {children || past}
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
