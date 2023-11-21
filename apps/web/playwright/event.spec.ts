import { expect, test } from '@playwright/test';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from 'libs/test-utils/db/src/index';

let client: PgClient;

test.beforeAll(async () => {
  client = await createDbClient();
});

test.afterAll(async () => {
  await client.end();
});

test.afterEach(async () => {
  await deleteAllTables(client);
});

test.beforeEach(async () => {
  await applySeeds(client, ['account', 'kyc', 'eventPassPricing']);
});

test('test', async ({ page }) => {
  await page.goto('/en');
  await new Promise((resolve) => setTimeout(resolve, 7000));
  await expect(
    page.getByRole('button', { name: 'agouasmi@offline.live', exact: true }),
  ).toBeVisible();

  await page.goto('/en/organizer/test/event/test-an-event');
  await expect(page.getByRole('img', { name: 'An event' })).toBeVisible();
  await expect(page.getByText('Wed, Jun 28, 2023, 2:08 PM')).toBeVisible();
  await expect(page.getByText('Thu, Jun 22, 2023, 8:40 PM')).toBeVisible();
  await page
    .getByRole('button', { name: 'Qr Code Select passes' })
    .first()
    .click();
  await new Promise((resolve) => setTimeout(resolve, 7000));
  await page
    .locator('div')
    .filter({ hasText: /^€82\.500$/ })
    .getByLabel('increment value')
    .click();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await expect(page.getByText('1 pass selected')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Total Price: €82.50' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cart Go to payment' }).click();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await page
    .getByRole('button', { name: 'An event An event 1 pass' })
    .click({ timeout: 5000 });
  await expect(
    page.getByLabel('An event1 pass').locator('div').first(),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Delete Remove' }),
  ).toBeVisible();
});

/*test('playwright direct login allow logged user to see his infos', async ({
  context,
  page,
}) => {
  await page.evaluate((address) => {
    window.ethereum = {
      request: async ({ method }) => {
        if (method === 'eth_accounts') {
          return [address];
        }
        throw new Error(`Unhandled method: ${method}`);
      },
    };
  }, users.alpha_user.user.address);

  await login(context, page, 'alpha_user');

  await page.evaluate((address) => {
    window.ethereum = {
      request: async ({ method }) => {
        if (method === 'eth_accounts') {
          return [address];
        }
        throw new Error(`Unhandled method: ${method}`);
      },
    };
  }, users.alpha_user.user.address);

  await page.goto('/en/settings');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await page.goto('/');
});*/

/*test('has title', async ({ browser }) => {
  // Create a new incognito browser context
  const context = await browser.newContext();
  await context.addCookies([
    {
      domain: 'localhost',
      httpOnly: false,
      name: 'NEXT_CURRENCY',
      path: '/',
      secure: false,
      value: 'EUR',
    },
    {
      domain: 'localhost',
      httpOnly: false,
      name: 'NEXT_LOCALE',
      path: '/',
      sameSite: 'Strict',
      secure: false,
      value: 'en',
    },
    {
      domain: 'localhost',
      httpOnly: true,
      name: 'next-auth.callback-url',
      path: '/',
      sameSite: 'Lax',
      secure: false,
      value: 'http%3A%2F%2Flocalhost%3A8888%2Fen',
    },
    {
      domain: 'localhost',
      httpOnly: true,
      name: 'next-auth.csrf-token',
      path: '/',
      sameSite: 'Lax',
      secure: false,
      value:
        '6fb0054e3b25f951a473aa28c9f91ed20ecb626f0ec6e72cff6bdbdb1b11198b%7C37b1e67d598e9dff6c035184dbe93eecc651d1727916b395ab9ac13985e555f6',
    },
    {
      domain: 'localhost',
      httpOnly: true,
      name: 'next-auth.session-token',
      path: '/',
      sameSite: 'Lax',
      secure: false,
      value:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYzEyY2ZkZjgtZDcxZi00OTcyLWE4ZTktMWVjYmM1MTEzNDk0IiwiYWRkcmVzcyI6IjB4YjFBNkQwNjkxMzY5NUNGMzEyNjJENDJhMWUzOUUxOWNhOWYyMTIxZCIsImVtYWlsIjoiZ291YXNtaS5hbGV4YW5kcmVAZ21haWwuY29tIiwiZW1haWxWZXJpZmllZCI6ZmFsc2UsIm9yZ2FuaXplcklkIjpudWxsLCJreWMiOnsiYXBwbGljYW50SWQiOiI2NTUzNTU0NzY5Y2FhNTIxMGZmMThlMjQiLCJyZXZpZXdTdGF0dXMiOiJpbml0IiwibGV2ZWxOYW1lIjoiYmFzaWNfa3ljX2xldmVsIn19LCJwcm92aWRlciI6ImNyZWRlbnRpYWxzIiwicHJvdmlkZXJUeXBlIjoiY3JlZGVudGlhbHMiLCJyb2xlIjoidXNlciIsImFjY2VzcyI6eyJwYXRoUGVybWlzc2lvbnMiOlt7Im1hdGNoIjp7InBhdGgiOiIvbG9jYWwvdXNlcnMvMHhiMUE2RDA2OTEzNjk1Q0YzMTI2MkQ0MmExZTM5RTE5Y2E5ZjIxMjFkIiwic2NvcGUiOiJHcmFuZGNoaWxkcmVuKyJ9LCJwZXJtaXNzaW9ucyI6eyJyZWFkIjp7ImZpbGUiOnsiZG93bmxvYWRGaWxlIjpbIioiXSwiZ2V0RmlsZURldGFpbHMiOnRydWV9fSwid3JpdGUiOnsiZmlsZSI6eyJjcmVhdGVGaWxlIjpmYWxzZSwiZGVsZXRlRmlsZSI6ZmFsc2UsIm92ZXJ3cml0ZUZpbGUiOmZhbHNlfX19fV19LCJzdWIiOiJjMTJjZmRmOC1kNzFmLTQ5NzItYThlOS0xZWNiYzUxMTM0OTQiLCJleHAiOjE3MDA2MDk1MjUsImlhdCI6MTY5OTk2MTUyNX0.YIh_06E1LXtqZxlwS6-oKnJVgwrygmW76nxLVQEv1sgvaWCsSCBxmrNnQwzgo8_ESG02IZcGBpAYCLNGpNhu8FW1LTBn1dkYa5u9HdIuYRbE3WfElTpyKWn2JXsbjKwt-SaxDIlJRoY6Sq4gjtt8_0mOLZbqrbiRzT1f1RmhrH7HLqpGceNBufM8LpaXTe1YEwU30ag1Sh2qJpDMb1Vy36TSLrN0DRUv6-8OeVd4e-FYFvS9xmRzH6rVtpYBpIisYsfpdeTxcJ75_iBfIxUZrdytePSBMv4LTXY7aTiJGFCf0bcH_0vhLJ1MakSayTl-vwwNt7P6CPMSuvtyDfziuQ',
    },
  ]);
  // Create a new page inside context.
  const page = await context.newPage();
  await page.goto('http://localhost:8888');
  await expect(page.getByRole('button', { name: 'Pass' })).toBeVisible();
  console.log(await context.cookies());
  await expect(page.getByRole('img', { name: 'An event' })).toBeVisible();
  await expect(page.getByText('Wed, Jun 28, 2023, 2:08 PM')).toBeVisible();
  await expect(page.getByText('Thu, Jun 22, 2023, 8:40 PM')).toBeVisible();
  await page
    .getByRole('button', { name: 'Qr Code Select passes' })
    .first()
    .click();
  await page.goto('en/organizer/test/event/test-an-event/purchase');
  await expect(page.getByRole('heading', { name: '€82.50' })).toBeVisible();
  await page
    .locator('div')
    .filter({ hasText: /^€82\.500$/ })
    .getByLabel('increment value')
    .click();
  await expect(page.getByText('1 pass selected')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Total Price: €82.50' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cart Go to payment' }).click();
  await page
    .getByRole('button', { name: 'An event An event 1 pass' })
    .click({ timeout: 5000 });
  await expect(page.getByRole('heading', { name: 'VIP' })).toBeVisible();
  await expect(page.getByText('€82.50')).toBeVisible();
  await expect(
    page.getByLabel('An event1 pass').locator('div').first(),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Delete Remove' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Log In Sign in' }),
  ).toBeVisible();
});*/
