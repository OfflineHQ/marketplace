import { AppUser } from '@next/types';
import { expect } from '@playwright/test';
import { accounts } from '@test-utils/gql';
import * as path from 'path';
import { chromium } from 'playwright';

interface LoadUserProps {
  user: keyof typeof accounts;
  goTo?: string;
}

export async function loadAccount({ user, goTo = '/en' }: LoadUserProps) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: path.resolve(__dirname, './', `${user as string}.json`),
  });
  const page = await context.newPage();
  const account: AppUser = accounts[user];
  await page.exposeFunction('useE2EAuthContext', () => {
    return JSON.stringify({
      login: () => null,
      logout: () => null,
      createAccount: () => null,
      connecting: false,
    });
  });
  await page.goto(goTo);
  await expect(
    page.getByRole('button', { name: account.email, exact: false }),
  ).toBeVisible();
  return { page, account };
}
