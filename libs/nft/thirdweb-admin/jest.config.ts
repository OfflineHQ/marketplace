/* eslint-disable */
export default {
  displayName: 'nft-thirdweb-admin',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/nft/thirdweb-admin',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
