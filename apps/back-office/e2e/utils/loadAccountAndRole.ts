import { AppUser } from '@next/types';
import { expect } from '@playwright/test';
import { accounts } from '@test-utils/gql';
import { chromium } from 'playwright';

interface LoadUserProps {
  user: keyof typeof accounts;
  goTo?: string;
  role: string;
}

export async function loadAccountAndRole({
  user,
  goTo = '/en',
  role,
}: LoadUserProps) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: `apps/back-office/e2e/utils/${user as string}.json`,
  });
  const page = await context.newPage();
  const account: AppUser = accounts[user];
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
  await page.getByRole('button', { name: account.email, exact: true }).click();
  await page.getByRole('menuitem', { name: role }).click();
  return { page, account };
}
