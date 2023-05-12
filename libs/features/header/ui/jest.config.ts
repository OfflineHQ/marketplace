/* eslint-disable */
export default {
  displayName: 'features-header-ui',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleNameMapper: {
    '@formkit/auto-animate/react':
      '<rootDir>/../../../../__mocks__/@formkit/auto-animate/react.js',
    'auto-animate': '<rootDir>/../../../../__mocks__/auto-animate.tsx',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/features/header/ui',
};
