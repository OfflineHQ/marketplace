/* eslint-disable */
export default {
  displayName: 'gql-anonymous-api',
  preset: '../../../../jest.preset.js',
  globals: {},
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/gql/anonymous/api',
};
