import { kv } from '@vercel/kv';
import init from './test-utils-cache';

describe('test-utils-cache', () => {
  beforeAll(async () => {
    await kv.flushall();
  });

  it('should initialize correctly', async () => {
    await init();
    console.log(await kv.keys('*'));
  });
});
