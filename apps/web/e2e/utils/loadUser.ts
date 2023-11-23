import { Page } from 'playwright';
import type { AppUser } from '@next/types';

export async function loadUser(page: Page, user: AppUser, name: string) {
  await page.exposeFunction('useE2EAuthContext', () => {
    return JSON.stringify({
      safeUser: {
        eoa: user.address,
        safes: [],
        email: user.email,
        name: name,
        profileImage: 'https://robohash.org/johndoe.png?size=96x96',
      },
      safeAuth: 'safeAuth',
      provider: 'provider',
      login: 'Login method called',
      logout: 'Logout method called',
      loginSiwe: 'loginSiwe',
      logoutSiwe: 'logoutSiwe',
      connecting: 'connecting',
    });
  });
  await page.exposeFunction('ethereum', () => {
    return {
      blockchain: 'ethereum',
      accounts: {
        return: [user.address],
      },
    };
  });
}
