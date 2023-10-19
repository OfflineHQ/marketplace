/* eslint-disable */
export default {
  displayName: 'features--cart-cron',
  preset: '../../../jest.preset.js',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/features/cart-cron',
};
