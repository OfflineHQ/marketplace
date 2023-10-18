'use server';

import { Currency } from '@currency/api';
import { Currency_Enum_Not_Const } from '@currency/types';
import { Cache } from '@next/cache';
import { isJestRunning } from '@utils';
import { revalidateTag } from 'next/cache';

const currencyApi = new Currency();
const cacheApi = new Cache();

class CacheApiError extends Error {
  constructor(
    message: string,
    public originalError: unknown,
  ) {
    super(message);
  }
}

function getCacheKey(currency: Currency_Enum_Not_Const): string {
  return `currency-${currency}-rates`;
}

function withCacheKey(
  fn: (key: string, currency: Currency_Enum_Not_Const) => Promise<any>,
) {
  return async (currency: Currency_Enum_Not_Const) => {
    const key = getCacheKey(currency);
    return fn(key, currency);
  };
}

export const setRate = withCacheKey(
  async (key: string, currency: Currency_Enum_Not_Const): Promise<void> => {
    try {
      const rate = await currencyApi.getRate(currency);
      await cacheApi.set(key, rate);
    } catch (error) {
      throw new CacheApiError(`Failed to get rate for ${currency}`, error);
    }
  },
);

export const getRate = withCacheKey(
  async (key: string, currency: Currency_Enum_Not_Const): Promise<number> => {
    try {
      const rate = await cacheApi.get(key);
      return rate as number;
    } catch (error) {
      throw new CacheApiError(
        `Failed to get rate from cache for ${currency}`,
        error,
      );
    }
  },
);

export async function setRates(): Promise<void[]> {
  const promises = Object.values(Currency_Enum_Not_Const).map((currency) =>
    setRate(currency),
  );
  if (!isJestRunning()) {
    revalidateTag('currency-rates');
  }
  return await Promise.all(promises);
}

export async function getRates(): Promise<{
  [key in Currency_Enum_Not_Const]: {
    [key in Currency_Enum_Not_Const]: number;
  };
}> {
  const promises = Object.values(Currency_Enum_Not_Const).map(
    async (currency) => {
      const rate = await getRate(currency);
      return { [currency]: rate };
    },
  );
  const rates = await Promise.all(promises);
  return Object.assign({}, ...rates);
}

export async function populateCacheIfEmpty(): Promise<void> {
  try {
    const rate = await getRate(Currency_Enum_Not_Const.EUR);
    if (!rate) {
      await setRates();
    }
    console.log('Populated cache for currency has been called successfully');
  } catch (error) {
    console.error('Failed to populate cache for currency', error);
  }
}
