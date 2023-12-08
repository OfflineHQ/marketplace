import { unstable_cache } from 'next/cache';
export function cacheWithDynamicKeys<T extends (...args: any[]) => any>(
  cb: T,
  keyGenerator: (args: Parameters<T>) => string[],
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    const keyParts = keyGenerator(args);
    return unstable_cache(cb, keyParts)(...args) as ReturnType<T>;
  };
}
