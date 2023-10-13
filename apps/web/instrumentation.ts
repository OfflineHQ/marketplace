import { populateCacheIfEmpty } from '@next/currency-cache';

export async function register() {
  try {
    await populateCacheIfEmpty();
    console.log('Populated cache for currency has been called successfully');
  } catch (error) {
    console.error(error);
  }
}
