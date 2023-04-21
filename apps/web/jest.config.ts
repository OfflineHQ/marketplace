/* eslint-disable */
export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '@formkit/auto-animate/react':
      '<rootDir>/../../__mocks__/@formkit/auto-animate/react.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
};
