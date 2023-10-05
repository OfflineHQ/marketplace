/* eslint-disable */
export default {
  displayName: 'features-cart',
  preset: '../../../jest.preset.js',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  coverageDirectory: '../../../coverage/libs/features/cart',
};
