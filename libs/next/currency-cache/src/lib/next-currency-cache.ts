import { Currency } from '@currency/api';
import { Currency_Enum_Not_Const } from '@currency/types';
import { Cache } from '@next/cache';
import { isJestRunning } from '@utils';
import { revalidateTag } from 'next/cache';

class CacheApiError extends Error {
  constructor(
    message: string,
    public originalError: unknown,
  ) {
    super(message);
  }
}

export class CurrencyCache {
  private currencyApi: Currency;
  private cacheApi: Cache;

  constructor(currencyApi?: Currency, cacheApi?: Cache) {
    this.currencyApi = currencyApi || new Currency();
    this.cacheApi = cacheApi || new Cache();
  }

  getCacheKey(currency: Currency_Enum_Not_Const): string {
    return `currency-${currency}-rates`;
  }

  withCacheKey<T>(
    fn: (key: string, currency: Currency_Enum_Not_Const) => Promise<T>,
  ) {
    return async (currency: Currency_Enum_Not_Const) => {
      const key = this.getCacheKey(currency);
      return fn(key, currency);
    };
  }

  setRate = this.withCacheKey<void>(
    async (key: string, currency: Currency_Enum_Not_Const) => {
      try {
        const rate = await this.currencyApi.getRate(currency);
        await this.cacheApi.kv.set(key, rate);
      } catch (error) {
        throw new CacheApiError(`Failed to get rate for ${currency}`, error);
      }
    },
  );

  getRate = this.withCacheKey<number>(
    async (key: string, currency: Currency_Enum_Not_Const) => {
      try {
        const rate = await this.cacheApi.kv.get(key);
        return rate as number;
      } catch (error) {
        throw new CacheApiError(
          `Failed to get rate from cache for ${currency}`,
          error,
        );
      }
    },
  );

  async setRates(): Promise<void[]> {
    const promises = Object.values(Currency_Enum_Not_Const).map((currency) =>
      this.setRate(currency),
    );
    if (!isJestRunning()) {
      revalidateTag('currency-rates');
    }
    return await Promise.all(promises);
  }

  async getRates(): Promise<{
    [key in Currency_Enum_Not_Const]: {
      [key in Currency_Enum_Not_Const]: number;
    };
  }> {
    const promises = Object.values(Currency_Enum_Not_Const).map(
      async (currency) => {
        const rate = await this.getRate(currency);
        return { [currency]: rate };
      },
    );
    const rates = await Promise.all(promises);
    return Object.assign({}, ...rates);
  }

  async populateCacheIfEmpty(): Promise<void> {
    try {
      const rate = await this.getRate(Currency_Enum_Not_Const.Eur);
      if (!rate) {
        await this.setRates();
      }
      console.log('Populated cache for currency has been called successfully');
    } catch (error) {
      console.error('Failed to populate cache for currency', error);
    }
  }
}
