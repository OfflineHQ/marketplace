import Currency from '@currency/api';
import { Currency_Enum_Not_Const } from '@currency/types';
import Cache from '@next/cache';
import { getRate, getRates, setRate, setRates } from './next-currency-cache';

jest.mock('@currency/api');
jest.mock('@next/cache');

describe('nextCurrencyCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set rate', async () => {
    const mockRate = 1.23;
    Currency.prototype.getRate = jest.fn().mockResolvedValue(mockRate);
    Cache.prototype.set = jest.fn().mockResolvedValue(undefined);

    await setRate(Currency_Enum_Not_Const.EUR);

    expect(Currency.prototype.getRate).toHaveBeenCalledWith(
      Currency_Enum_Not_Const.EUR
    );
    expect(Cache.prototype.set).toHaveBeenCalledWith(
      `currency-${Currency_Enum_Not_Const.EUR}-rates`,
      mockRate
    );
  });

  it('should get rate', async () => {
    const mockRate = 1.23;
    Cache.prototype.get = jest.fn().mockResolvedValue(mockRate);

    const rate = await getRate(Currency_Enum_Not_Const.EUR);

    expect(rate).toEqual(mockRate);
    expect(Cache.prototype.get).toHaveBeenCalledWith(
      `currency-${Currency_Enum_Not_Const.EUR}-rates`
    );
  });

  it('should set rates', async () => {
    Currency.prototype.getRate = jest.fn().mockResolvedValue(1.23);
    Cache.prototype.set = jest.fn().mockResolvedValue(undefined);

    await setRates();

    expect(Currency.prototype.getRate).toHaveBeenCalledTimes(
      Object.values(Currency_Enum_Not_Const).length
    );
    expect(Cache.prototype.set).toHaveBeenCalledTimes(
      Object.values(Currency_Enum_Not_Const).length
    );
  });

  it('should get rates', async () => {
    const mockRate = 1.23;
    Cache.prototype.get = jest.fn().mockResolvedValue(mockRate);

    const rates = await getRates();

    expect(rates).toEqual(
      Object.fromEntries(
        Object.values(Currency_Enum_Not_Const).map((currency) => [
          currency,
          mockRate,
        ])
      )
    );
    expect(Cache.prototype.get).toHaveBeenCalledTimes(
      Object.values(Currency_Enum_Not_Const).length
    );
  });
});
