import { PassNav, type PassNavProps } from '@features/app-nav';
import { useTranslations } from 'next-intl';
// import { getCurrentUser } from '@next/next-auth/user';;

export default async function PassNavSection() {
  // const user = await getCurrentUser();
  // TODO get user passes if connected.
  // const cart = await getCart(getUser);
  return <PassNavSectionContent />;
}

function PassNavSectionContent(
  props: Pick<PassNavProps, 'ping' | 'isLoading'>,
) {
  const t = useTranslations('AppNav.Pass');
  return (
    <PassNav
      text={t('text')}
      href="/pass"
      helperText={t('helper-text')}
      {...props}
    />
  );
}
