import { unstable_cache } from 'next/cache';

export function cacheWithDynamicKeys<
  T extends (...args: any[]) => Promise<any>,
>(
  cb: T,
  keyGenerator: (args: Parameters<T>) => Promise<string[]>,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    const keyParts = await keyGenerator(args);
    return unstable_cache(cb, keyParts)(...args) satisfies Promise<
      ReturnType<T>
    >;
  };
}
