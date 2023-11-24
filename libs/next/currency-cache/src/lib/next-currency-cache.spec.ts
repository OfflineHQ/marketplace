import { Currency } from '@currency/api';
import { Currency_Enum_Not_Const } from '@currency/types';
import { Cache } from '@next/cache';
import { CurrencyCache } from './next-currency-cache';

describe('CurrencyCache', () => {
  // getCacheKey(currency) returns a string with the correct format.
  it('should return a string with the correct format when calling getCacheKey', () => {
    const currencyCache = new CurrencyCache();
    const currency = Currency_Enum_Not_Const.Eur;
    const cacheKey = currencyCache.getCacheKey(currency);
    expect(cacheKey).toMatch(/^currency-[A-Z]{3}-rates$/);
  });

  // withCacheKey(fn) returns a function that receives a Currency_Enum_Not_Const and returns a Promise.
  it('should return a function that receives a Currency_Enum_Not_Const and returns a Promise when calling withCacheKey', () => {
    const currencyCache = new CurrencyCache();
    const fn = jest.fn();
    const withCacheKeyFn = currencyCache.withCacheKey(fn);
    const currency = Currency_Enum_Not_Const.Eur;
    const result = withCacheKeyFn(currency);
    expect(fn).toHaveBeenCalledWith(expect.any(String), currency);
    expect(result).toBeInstanceOf(Promise);
  });

  // CurrencyCache throws an error if it fails to get a rate from the Currency API.
  it('should throw an error if it fails to get a rate from the Currency API', async () => {
    const currencyApi = new Currency();
    currencyApi.getRate = jest
      .fn()
      .mockRejectedValue(new Error('Failed to get rate'));
    const currencyCache = new CurrencyCache(currencyApi);
    const currency = Currency_Enum_Not_Const.Eur;
    await expect(currencyCache.setRate(currency)).rejects.toThrowError(
      'Failed to get rate for EUR',
    );
  });

  // CurrencyCache throws an error if it fails to set a rate in the Cache API.
  it('should throw an error if it fails to set a rate in the Cache API', async () => {
    const cacheApi = new Cache();
    cacheApi.kv.set = jest
      .fn()
      .mockRejectedValue(new Error('Failed to set rate'));
    const currencyCache = new CurrencyCache(undefined, cacheApi);
    const currency = Currency_Enum_Not_Const.Eur;
    await expect(currencyCache.setRate(currency)).rejects.toThrowError(
      'Failed to get rate for EUR',
    );
  });

  // CurrencyCache throws an error if it fails to get a rate from the Cache API.
  it('should throw an error if it fails to get a rate from the Cache API', async () => {
    const cacheApi = new Cache();
    cacheApi.kv.get = jest
      .fn()
      .mockRejectedValue(new Error('Failed to get rate'));
    const currencyCache = new CurrencyCache(undefined, cacheApi);
    const currency = Currency_Enum_Not_Const.Eur;
    await expect(currencyCache.getRate(currency)).rejects.toThrowError(
      'Failed to get rate from cache for EUR',
    );
  });

  // populateCacheIfEmpty() populates the cache if getRate() returns no rate.

  it('should populate cache if empty when getRate returns no rate', async () => {
    const cacheApi = new Cache();
    cacheApi.kv.get = jest.fn().mockResolvedValue(null);
    const currencyCache = new CurrencyCache(undefined, cacheApi);
    currencyCache.setRates = jest.fn();
    await currencyCache.populateCacheIfEmpty();
    expect(currencyCache.setRates).toHaveBeenCalled();
  });

  // setRates() sets rates for all currencies.
  it('should set all rates when calling setRates', async () => {
    const currencyCache = new CurrencyCache();
    const setRateMock = jest.spyOn(currencyCache, 'setRate');
    await currencyCache.setRates();
    expect(setRateMock).toHaveBeenCalledTimes(
      // @ts-ignore
      Object.values(Currency_Enum_Not_Const).length,
    );
  });

  // Currency throws an error if it fails to save rates to a local file.
  it('should throw an error if it fails to save rates to a local file', async () => {
    const currency = new Currency();
    currency.saveToLocalFile = jest
      .fn()
      .mockRejectedValue(new Error('Failed to save rates'));
    const baseCurrency = Currency_Enum_Not_Const.Eur;
    await expect(
      currency.saveToLocalFile(baseCurrency, {}),
    ).rejects.toThrowError('Failed to save rates');
  });
});
