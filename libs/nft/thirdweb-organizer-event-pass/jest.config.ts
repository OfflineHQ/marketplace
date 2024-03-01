/* eslint-disable */
export default {
  displayName: 'nft-thirdweb-organizer-event-pass',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
  coverageDirectory: '../../../coverage/libs/nft/thirdweb-organizer-event-pass',
};
