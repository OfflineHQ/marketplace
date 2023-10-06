import { CartNav } from '../CartNav/CartNav';
import { NavSectionSkeleton } from '../NavSection/NavSection';
import { PassNav } from '../PassNav/PassNav';
import { ProfileNav, ProfileNavSkeleton } from '../ProfileNav/ProfileNav';
import {
  notConnectedMenuItems,
  normalUserMenuItems,
  cryptoUserMenuItems,
} from '../ProfileNav/examples';
import {
  normalUserSessionWithImage,
  normalUserSession,
  cryptoUserSession,
} from '../profile-avatar/examples';
export {
  cryptoUserMenuItems,
  normalUserMenuItems,
  notConnectedMenuItems,
} from '../ProfileNav/examples';
export {
  cryptoUserSession,
  normalUserSession,
  normalUserSessionWithImage,
} from '../profile-avatar/examples';

export const ProfileNavWithNoUser = () => (
  <ProfileNav
    user={undefined}
    items={notConnectedMenuItems}
    signInText="Sign in"
  />
);

export const ProfileNavWithNoUserLoading = () => (
  <ProfileNav
    user={undefined}
    items={notConnectedMenuItems}
    isLoading={true}
    signInText="Sign in"
  />
);

export const ProfileNavWithNormalUser = () => (
  <ProfileNav
    user={normalUserSessionWithImage}
    items={normalUserMenuItems}
    signInText="Sign in"
  />
);

export const ProfileNavWithFallbackUser = () => (
  <ProfileNav
    user={normalUserSession}
    items={normalUserMenuItems}
    signInText="Sign in"
  />
);

export const ProfileNavWithCryptoUser = () => (
  <ProfileNav
    user={cryptoUserSession}
    items={cryptoUserMenuItems}
    signInText="Sign in"
  />
);

export const CartNavEmpty = () => <CartNav text="Cart" href="/cart" />;

export const CartNavWithItems = () => (
  <CartNav text="Cart" href="/cart" ping={{ isActive: true, number: 3 }} />
);

export const PassNavEmpty = () => <PassNav text="Pass" href="/pass" />;

export const PassNavWithPing = () => (
  <PassNav text="Pass" href="/pass" ping={{ isActive: true }} />
);
export const PassNavLoading = () => (
  <PassNav text="Pass" href="/pass" isLoading />
);

export const NavSectionLoading = () => <NavSectionSkeleton />;

export const ProfileNavLoading = () => <ProfileNavSkeleton />;
