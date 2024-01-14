/* eslint-disable */
export default {
  displayName: 'indexer-alchemy-webhooks-integration',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/payment/admin-integration',
  testMatch: ['**/*.integration.test.ts'],
};
