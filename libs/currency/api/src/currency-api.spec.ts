import Currency from './index';

describe('Currency class', () => {
  let currency: Currency;

  beforeEach(() => {
    currency = new Currency();
  });

  describe('getRate method', () => {
    it('should get rates from Fixer API and save to local file', async () => {
      const mockRates = { USD: 1.2, GBP: 0.85 };
      const baseCurrency = 'EUR';

      const rates = await currency.getRate(baseCurrency);

      expect(rates).toEqual(mockRates);
    });
  });
});
