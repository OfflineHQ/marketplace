import { PassNav, type PassNavProps } from '@features/appNav/ui';
import { useTranslations } from 'next-intl';
import { getCurrentUser } from '@web/lib/session';

export default async function PassNavSection() {
  const session = await getCurrentUser();
  console.log({ session });
  // TODO get user passes if connected.
  // const cart = await getCart(getUser);
  return <PassNavSectionContent />;
}

function PassNavSectionContent(
  props: Pick<PassNavProps, 'ping' | 'isLoading'>
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
