import { Roles_Enum } from '@gql/shared/types';
import { getMessages } from '@next/i18n';
import { AppUser } from '@next/types';
import { expect } from '@playwright/test';
import { accounts } from '@test-utils/gql';
import * as path from 'path';
import { chromium } from 'playwright';

interface LoadUserProps {
  user: keyof typeof accounts;
  goTo?: string;
  role: Roles_Enum;
}

let roleNames: { [key in Roles_Enum]?: string };

export async function loadAccountAndRole({
  user,
  goTo = '/en',
  role,
}: LoadUserProps) {
  const englishMessages = await getMessages('en');

  roleNames = {
    [Roles_Enum.OrganizerAdmin]:
      englishMessages.Roles.RoleBadge['organizer-admin'],
    [Roles_Enum.OrganizerAuditor]:
      englishMessages.Roles.RoleBadge['organizer-auditor'],
    [Roles_Enum.OrganizerContentManager]:
      englishMessages.Roles.RoleBadge['organizer-content-manager'],
    [Roles_Enum.OrganizerFinanceManager]:
      englishMessages.Roles.RoleBadge['organizer-finance-manager'],
    [Roles_Enum.OrganizerGuest]:
      englishMessages.Roles.RoleBadge['organizer-guest'],
    [Roles_Enum.OrganizerHumanResources]:
      englishMessages.Roles.RoleBadge['organizer-human-resources'],
    [Roles_Enum.OrganizerOperationsManager]:
      englishMessages.Roles.RoleBadge['organizer-operations-manager'],
    [Roles_Enum.OrganizerSuperAdmin]:
      englishMessages.Roles.RoleBadge['organizer-super-admin'],
    [Roles_Enum.OrganizerValidator]:
      englishMessages.Roles.RoleBadge['organizer-validator'],
  };

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
  await page.getByRole('button', { name: account.email, exact: false }).click();
  const roleName = roleNames[role];
  if (!roleName) {
    throw new Error(`Role name not found for role: ${role}`);
  }
  await page.getByText(roleName).click();
  return { page, account };
}
