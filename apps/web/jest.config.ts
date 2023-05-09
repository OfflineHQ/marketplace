/* eslint-disable */
export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  transform: {
    // '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.(js|ts|tsx)?$': [
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
    'auto-animate': '<rootDir>/../../__mocks__/auto-animate.tsx',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
};
