import { useTranslations } from 'next-intl';
import { UserPass, NoUserPass } from '@features/pass';
import { getCurrentUser } from '@next/next-auth/user';

export interface PassLayoutProps {
  children: React.ReactNode;
}

export default async function PassLayout(props: PassLayoutProps) {
  const user = await getCurrentUser();
  return <PassLayoutContent {...props} getUser={!!user} />;
}

interface PassLayoutContentProps extends PassLayoutProps {
  getUser: boolean;
}

function PassLayoutContent({ children, getUser }: PassLayoutContentProps) {
  const t = useTranslations('Pass.NoUserPass');
  const tUserPass = useTranslations('Pass.UserPass');
  return getUser ? (
    <UserPass
      title={tUserPass('title')}
      comingSoon={tUserPass('upcoming')}
      past={tUserPass('past')}
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
