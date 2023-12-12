/* eslint-disable */
export default {
  displayName: 'nft-thirdweb-organizer',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/nft/thirdweb-organizer',
  testMatch: ['**/*.integration.test.ts'],
  maxConcurrency: 1,
};
