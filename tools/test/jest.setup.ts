// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './tools/test/.env.test.jest' });
jest.mock('@formkit/auto-animate/react');

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return null;
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
global.TextEncoder = require('util').TextEncoder;
