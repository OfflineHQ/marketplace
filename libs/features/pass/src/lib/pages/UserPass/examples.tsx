import { NextAuthProvider } from '@next/auth';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';
import { UserPass } from './UserPass';
import { useTranslations } from 'next-intl';

export function UserPassExample({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Pass.UserPass');
  return (
    <AppNavLayout
      {...WithNormalUser.args}
      children={
        <UserPass
          title={t('title')}
          comingSoon={t('coming-soon')}
          past={t('past')}
          children={children}
        />
      }
    />
  );
}
