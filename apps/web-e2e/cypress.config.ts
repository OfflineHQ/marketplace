import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { deleteUser, deleteUsers, seedDb, queryDb } from '@test-utils/db';

const cypressConfigGlobal = {
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
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
    chromeWebSecurity: true,
    baseUrl: `http://localhost:${process.env.CLIENT_PORT}`,
    supportFile: 'src/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async 'db:delete-user'(email: string) {
          await deleteUser(email);
          return true;
        },
        async 'db:delete-users'() {
          await deleteUsers();
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
