/* eslint-disable */
export default {
  displayName: 'payment-admin',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/payment/admin',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
