/* eslint-disable */
export default {
  displayName: 'features-back-office-roles-api-integration',
  preset: '../../../../jest.preset.js',
  setupFiles: [
    `${process.cwd()}/tools/test/jest.setup.ts`,
    `${process.cwd()}/tools/test/jest.setup.back-office.ts`,
  ],
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/features/back-office/roles-api-integration',
  testMatch: ['**/*.integration.test.ts'],
};
