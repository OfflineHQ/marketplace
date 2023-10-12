import { UserCartSection, type UserCartSectionProps } from './UserCartSection';

export type UserCartProps = UserCartSectionProps;

export async function UserCart({
  EventPassesFetcher,
  locale,
  noCartImage,
  user,
  children,
  userPassPendingOrders,
}: UserCartProps) {
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
