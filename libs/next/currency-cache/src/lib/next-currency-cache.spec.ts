import Currency from '@currency/api';
import { Currency_Enum_Not_Const } from '@currency/types';
import { Cache } from '@next/cache';
import { getRate, setRate, setRates } from './next-currency-cache';

jest.mock('@currency/api');
jest.mock('@next/cache');

describe('nextCurrencyCache', () => {
  const mockRate = 1.23;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest
      .spyOn(Cache.prototype, 'get')
      .mockImplementation(() => Promise.resolve(mockRate));
    jest
      .spyOn(Cache.prototype, 'set')
      .mockImplementation(() => Promise.resolve(undefined));
    jest
      .spyOn(Currency.prototype, 'getRate')
      .mockImplementation(() => Promise.resolve({ USD: mockRate }));
  });

  it('should set rate', async () => {
    Currency.prototype.getRate = jest.fn().mockResolvedValue(mockRate);

    await setRate(Currency_Enum_Not_Const.EUR);

    expect(Cache.prototype.set).toHaveBeenCalledWith(
      `currency-${Currency_Enum_Not_Const.EUR}-rates`,
      { USD: mockRate }
    );
  });

  it('should get rate', async () => {
    const rate = await getRate(Currency_Enum_Not_Const.EUR);

    expect(rate).toEqual(mockRate);
  });

  it('should set rates', async () => {
    Currency.prototype.getRate = jest.fn().mockResolvedValue(1.23);

    await setRates();

    expect(Cache.prototype.set).toHaveBeenCalled();
  });

  //it('should get rates', async () => {
  //  const rates = await getRates();

  //  expect(rates).toEqual(
  //    Object.fromEntries(
  //      Object.values(Currency_Enum_Not_Const).map((currency) => [
  //        currency,
  //        mockRate,
  //      ])
  //    )
  //  );
  //});
});
