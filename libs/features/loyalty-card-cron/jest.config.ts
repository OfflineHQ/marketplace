/* eslint-disable */
export default {
  displayName: 'loyalty-card-cron',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/features/loyalty-card-cron',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
