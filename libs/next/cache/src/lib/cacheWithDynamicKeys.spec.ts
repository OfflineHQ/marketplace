import { unstable_cache } from 'next/cache';
import { cacheWithDynamicKeys } from './cacheWithDynamicKeys';

jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn, keys) => fn),
}));

describe('cacheWithDynamicKeys', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // The cache key is generated dynamically based on the arguments passed.
  it('should generate the cache key dynamically based on the arguments passed', async () => {
    const cb = jest.fn((...args) => args.reduce((acc, val) => acc + val, 0));
    const keyGenerator = jest.fn(async (args) => args.map(String));
    const cachedFn = cacheWithDynamicKeys(cb, keyGenerator);

    await cachedFn(1, 2, 3);

    expect(keyGenerator).toHaveBeenCalledTimes(1);
    expect(keyGenerator).toHaveBeenCalledWith([1, 2, 3]);
  });

  // The cache key is passed to unstable_cache.
  it('should pass the cache key to unstable_cache', async () => {
    const cb = jest.fn((...args) => args.reduce((acc, val) => acc + val, 0));
    const keyGenerator = jest.fn(async (args) => args.map(String));
    const cachedFn = cacheWithDynamicKeys(cb, keyGenerator);

    await cachedFn(1, 2, 3);

    expect(unstable_cache).toHaveBeenCalledTimes(1);
    expect(unstable_cache).toHaveBeenCalledWith(cb, ['1', '2', '3']);
  });

  // The original function is called with the arguments passed.
  it('should call the original function with the arguments passed', async () => {
    const cb = jest.fn((...args) => args.reduce((acc, val) => acc + val, 0));
    const keyGenerator = jest.fn(async (args) => args.map(String));
    const cachedFn = cacheWithDynamicKeys(cb, keyGenerator);

    await cachedFn(1, 2, 3);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(1, 2, 3);
  });

  // The original function throws an error.
  it('should throw an error when the original function throws an error', async () => {
    const cb = jest.fn((arg1, arg2, arg3) => {
      throw new Error('Something went wrong');
    });
    const keyGenerator = jest.fn(async (args) => args.map(String));
    const cachedFn = cacheWithDynamicKeys(cb, keyGenerator);

    await expect(cachedFn(1, 2, 3)).rejects.toThrow('Something went wrong');
  });
});
