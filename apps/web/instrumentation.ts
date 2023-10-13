import { populateCacheIfEmpty } from '@next/currency-cache';

export async function register() {
  await populateCacheIfEmpty();
}
