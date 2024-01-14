/* eslint-disable */
export default {
  displayName: 'features-cart-cron',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/payment/admin',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
