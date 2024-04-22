/* eslint-disable */
export default {
  displayName: 'loyalty-card-cron',
  preset: '../../../jest.preset.js',
  setupFiles: [`${process.cwd()}/tools/test/jest.setup.ts`],
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs'],
  coverageDirectory: '../../../coverage/libs/features/loyalty-card-cron',
  testMatch: ['**/*.integration.test.ts'],
};
