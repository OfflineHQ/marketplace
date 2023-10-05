/* eslint-disable */
export default {
  displayName: 'gql-admin',
  preset: '../../../../jest.preset.js',
  globals: {},
  globalSetup: `${process.cwd()}/tools/test/globalSetupHasura.ts`,
  globalTeardown: `${process.cwd()}/tools/test/globalTeardownHasura.ts`,
  coverageDirectory: '../../../../coverage/libs/gql/admin/api',
};
