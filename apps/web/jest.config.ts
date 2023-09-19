// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './apps/web',
});

const customConfig = {
  displayName: 'web',
  preset: '../../jest.preset.js', // complain about server action: To use Server Actions, please enable the feature flag in your Next.js config. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#convention
  transform: {
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
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customConfig);
