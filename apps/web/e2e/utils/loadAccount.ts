import { expect } from '@playwright/test';
import { accounts } from '@test-utils/gql';
import { chromium } from 'playwright';

interface LoadUserProps {
  user: keyof typeof accounts;
  goTo?: string;
}

export async function loadAccount({ user, goTo = '/en' }: LoadUserProps) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: `apps/web/e2e/utils/${user}.json`,
    userAgent: 'My custom user agent',
  });
  const page = await context.newPage();
  const account = accounts[user];
  await page.exposeFunction('useE2EAuthContext', () => {
    return JSON.stringify({
      safeUser: {
        eoa: account.address,
        safes: [],
        email: account.email,
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
    page.getByRole('button', { name: account.email, exact: true }),
  ).toBeVisible();
  return { page, account };
}
