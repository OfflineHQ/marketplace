global.fetch = require('node-fetch');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './tools/test/.env.test.jest' });
import '@testing-library/jest-dom/extend-expect';
