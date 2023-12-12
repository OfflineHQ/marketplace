/* eslint-disable */
export default {
  displayName: 'next-currency-cache',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/next/currency-cache',
};
