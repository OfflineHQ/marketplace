import {
  cryptoUserSession,
  normalUserSessionWithImage,
} from '../profile-avatar/examples';
import {
  cryptoUserMenuItems,
  normalUserMenuItems,
  notConnectedMenuItems,
} from '../profile-nav/examples';
import { ProfileNav } from '../profile-nav/ProfileNav';
import { CartNav } from '../CartNav/CartNav';
import { PassNav } from '../PassNav/PassNav';
import { NavSectionSkeleton } from '../NavSection/NavSection';

export const ProfileNavWithNoUser = () => (
  <ProfileNav
    user={undefined}
    items={notConnectedMenuItems}
    signInTxt="Sign in"
  />
);

export const ProfileNavWithNormalUser = () => (
  <ProfileNav
    user={normalUserSessionWithImage}
    items={normalUserMenuItems}
    signInTxt="Sign in"
  />
);

export const ProfileNavWithCryptoUser = () => (
  <ProfileNav
    user={cryptoUserSession}
    items={cryptoUserMenuItems}
    signInTxt="Sign in"
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

export const NavSectionLoading = () => <NavSectionSkeleton />;
