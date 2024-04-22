/* eslint-disable */
export default {
  displayName: 'indexer-alchemy-webhooks',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  maxWorkers: 1,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/indexer/alchemy/webhooks',
  testPathIgnorePatterns: ['.*\\.integration\\..*'],
};
