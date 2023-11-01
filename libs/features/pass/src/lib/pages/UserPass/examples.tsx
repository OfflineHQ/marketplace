import { NextAuthProvider } from '@next/auth';
import { WithNormalUser } from '@features/app-nav/stories';
import { AppNavLayout } from '@features/app-nav';
import { Toaster } from '@ui/components';
import { UserPass } from './UserPass';
import { useTranslations } from 'next-intl';

export function UserPassExample({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Pass.UserPass');
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
          />
        }
      />
      <Toaster />
    </>
  );
}
