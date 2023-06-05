import { CartNav, type CartNavProps } from '@features/appNav/ui';
import { useTranslations } from 'next-intl';
import { getCurrentUser } from '@web/lib/session';

export default (async function CartNavSection() {
  const user = await getCurrentUser();
  // TODO get user cart if connected, otherwise get local storage cart from zustand.
  // const cart = await getCart(getUser);
  return <CartNavSectionContent />;
} as unknown as () => JSX.Element);

function CartNavSectionContent(
  props: Pick<CartNavProps, 'ping' | 'isLoading'>
) {
  const t = useTranslations('AppNav.Cart');
  return (
    <CartNav
      text={t('text')}
      href="/cart"
      helperText={t('helper-text')}
      {...props}
    />
  );
}
