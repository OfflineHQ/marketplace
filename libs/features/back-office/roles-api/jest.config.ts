/* eslint-disable */
export default {
  displayName: 'features-back-office-roles-api',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/features/back-office/roles-api',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
