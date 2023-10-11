import * as shared from '@shared/server';
import Currency from './index';

jest.mock('@shared/server');

describe('Currency class', () => {
  let currency: Currency;

  beforeEach(() => {
    currency = new Currency();
    global.fetch = jest.fn();
  });

  describe('getRate method', () => {
    it('should get rates from Fixer API and save to local file', async () => {
      const baseCurrency = 'EUR';
      const mockRates = { USD: 1.2, GBP: 0.85 };

      (shared.isPreviewOrProduction as jest.Mock).mockReturnValue(false);

      currency.fetchFromLocalFile = jest.fn().mockResolvedValue(mockRates);

      const rates = await currency.getRate(baseCurrency);

      expect(rates).toEqual(mockRates);
    });

    it('should get rates from ExchangeRate API and save to local file when Fixer API fails', async () => {
      const baseCurrency = 'EUR';
      const mockRates = { USD: 1.2, GBP: 0.85 };

      (shared.isPreviewOrProduction as jest.Mock).mockReturnValue(true);

      (fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Failed to fetch data from Fixer API'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ conversion_rates: mockRates }),
        });

      currency.fetchFromLocalFile = jest.fn().mockResolvedValue(mockRates);

      const rates = await currency.getRate(baseCurrency);

      expect(rates).toEqual(mockRates);
    });
  });
});
