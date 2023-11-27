/* eslint-disable */
export default {
  displayName: 'features-organizer-ui-integration',
  preset: '../../../../jest.preset.js',
  setupFiles: [`${process.cwd()}/tools/test/jest.setup.ts`],
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/features/organizer-ui-integration',
  testMatch: ['**/*.integration.test.ts'],
};
