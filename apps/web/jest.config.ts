// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './apps/web',
});

const customConfig = {
  displayName: 'web',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/web',
};

module.exports = createJestConfig(customConfig);
