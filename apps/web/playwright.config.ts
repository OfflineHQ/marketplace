import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:8888';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './e2e' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  webServer: {
    command:
      'export NEXT_PUBLIC_PLAYWRIGHT=true && pnpm nx run web:serve:development',
    url: 'http://127.0.0.1:8888',
    reuseExistingServer: !process.env.CI,
    cwd: './',
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
