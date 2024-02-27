/* eslint-disable */
export default {
  displayName: 'features-orders-cron-integration',
  preset: '../../../jest.preset.js',
  setupFiles: [`${process.cwd()}/tools/test/jest.setup.ts`],
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs'],
  coverageDirectory:
    '../../../../coverage/libs/features/orders-cron-integration',
  testMatch: ['**/*.integration.test.ts'],
};
