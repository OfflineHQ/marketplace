/* eslint-disable */
export default {
  displayName: 'features-pass-api-integration',
  preset: '../../../jest.preset.js',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/features/pass-api',
  testMatch: ['**/*.integration.test.ts'],
};
