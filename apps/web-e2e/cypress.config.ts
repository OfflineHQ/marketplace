import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { deleteAccount, deleteAccounts, seedDb, queryDb } from '@test-utils/db';

const cypressConfigGlobal = {
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 1200000, // very long because next 13 is slow to build pages
  responseTimeout: 1200000, // very long because next 13 is slow to build pages
  requestTimeout: 15000,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false, // Disable for now in local + CI
  videosFolder: '../../dist/cypress/apps/web-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-e2e/screenshots',
};

export default defineConfig({
  ...cypressConfigGlobal,
  e2e: {
    ...nxE2EPreset(__filename),
    chromeWebSecurity: false,
    baseUrl: `http://localhost:${process.env.NEXT_PORT}`,
    supportFile: 'src/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async 'db:delete-user'(email: string) {
          await deleteAccount(email);
          return true;
        },
        async 'db:delete-users'() {
          await deleteAccounts();
          return true;
        },
        async 'db:seed-db'(path: string) {
          await seedDb(path);
          return true;
        },
        async 'db:query-db'(sql: string) {
          await queryDb(sql);
          return true;
        },
        //...
      });
      return config;
    },
  },
});
