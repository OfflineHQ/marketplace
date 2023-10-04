import { getEventPassPendingOrders } from '../api/getEventPassPendingOrders';
import { UserCartSection, type UserCartSectionProps } from './UserCartSection';

export type UserCartProps = UserCartSectionProps;

export async function UserCart({
  EventPassesFetcher,
  locale,
  noCartImage,
  user,
  children,
}: UserCartProps) {
  const userPassPendingOrders = await getEventPassPendingOrders({ locale });
  return (
    <UserCartSection
      EventPassesFetcher={EventPassesFetcher}
      userPassPendingOrders={userPassPendingOrders}
      noCartImage={noCartImage}
      user={user}
      locale={locale}
      children={children}
    />
  );
}
