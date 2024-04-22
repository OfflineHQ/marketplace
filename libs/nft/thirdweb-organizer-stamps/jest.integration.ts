/* eslint-disable */
export default {
  displayName: 'nft-thirdweb-organizer-stamps-integration',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/libs/nft/thirdweb-organizer-stamps-integration',
  testMatch: ['**/*.integration.test.ts'],
};
