global.fetch = require('node-fetch');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './tools/test/.env.test.jest' });
jest.mock('@formkit/auto-animate/react');
jest.mock('@ui/components', () => {
  const originalModule = jest.requireActual('@ui/components');
  return {
    ...originalModule,
    AutoAnimate: jest.requireMock('./__mocks__/auto-animate').AutoAnimate,
  };
});
