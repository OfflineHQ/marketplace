import Currency from './index';

jest.mock('fs/promises');

describe('CurrencyApi basics', () => {
  let currency: Currency;

  beforeEach(() => {
    currency = new Currency();
  });

  it('should exist', () => {
    expect(currency).toBeDefined();
  });

  it('should work', async () => {
    await expect(currency.getRate('EUR')).resolves.not.toThrow();
  });
});

describe('Currency API Tests', () => {
  let currency: Currency;

  beforeEach(() => {
    currency = new Currency();
  });

  it('should console warn when rate limit exceeded on Fixer API', async () => {
    jest.spyOn(currency, 'fetchFromFixer').mockImplementation(() => {
      throw new Error('Rate limit exceeded on Fixer API');
    });

    const consoleSpy = jest.spyOn(console, 'warn');
    await currency.getRate('EUR');
    expect(consoleSpy).toHaveBeenCalledWith('Rate limit exceeded on Fixer API');
    consoleSpy.mockRestore();
  });

  it('should console warn when falling back to ExchangeRate API', async () => {
    jest.spyOn(currency, 'fetchFromFixer').mockImplementation(() => {
      throw new Error('Some error');
    });

    const consoleSpy = jest.spyOn(console, 'warn');
    await currency.getRate('EUR');
    expect(consoleSpy).toHaveBeenCalledWith('Falling back to ExchangeRate API');
    consoleSpy.mockRestore();
  });

  it('should throw error when both Fixer and ExchangeRate APIs fail', async () => {
    jest.spyOn(currency, 'fetchFromFixer').mockImplementation(() => {
      throw new Error('Fixer API error');
    });

    jest.spyOn(currency, 'fetchFromExchangeRate').mockImplementation(() => {
      throw new Error('ExchangeRate API error');
    });

    await expect(currency.getRate('EUR')).rejects.toThrow(
      'Error fetching rates for base currency : EUR'
    );
  });
});
