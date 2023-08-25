/* eslint-disable */
export default {
  displayName: 'indexer-alchemy-webhooks-integration',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/indexer/alchemy/webhooks',
  testMatch: ['**/*.integration.test.ts'],
};
