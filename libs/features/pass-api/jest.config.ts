/* eslint-disable */
export default {
  displayName: 'features-pass-api',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/features/pass-api',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
