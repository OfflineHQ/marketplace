import type { AppUser } from '@next/types';
import { expect } from '@playwright/test';
import { Page } from 'playwright';

interface LoadUserProps {
  page: Page;
  user: AppUser;
  goTo?: string;
}

export async function loadUser({ page, user, goTo = '/en' }: LoadUserProps) {
  await page.exposeFunction('useE2EAuthContext', () => {
    return JSON.stringify({
      safeUser: {
        eoa: user.address,
        safes: [],
        email: user.email,
        profileImage: 'https://robohash.org/johndoe.png?size=96x96',
      },
      safeAuth: 'safeAuth',
      provider: 'provider',
      login: () => null,
      logout: () => null,
      loginSiwe: () => null,
      logoutSiwe: () => null,
      connecting: false,
    });
  });
  await page.goto(goTo);
  await expect(
    page.getByRole('button', { name: 'alpha_user@test.io', exact: true }),
  ).toBeVisible();
}
