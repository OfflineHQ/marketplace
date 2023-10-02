import * as fs from 'fs';
import * as path from 'path';

export default class Currency {
  private FIXER_CURRENCY_API_KEY = process.env.FIXER_CURRENCY_API_KEY;
  private EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  async getRate(baseCurrency: string): Promise<{
    [key: string]: number;
  }> {
    try {
      return await this.fetchFromFixer(baseCurrency);
    } catch (error) {
      if ((error as Error).message.includes('rate limit')) {
        console.warn('Rate limit exceeded on Fixer API');
      }
      console.warn('Falling back to ExchangeRate API');
      try {
        return await this.fetchFromExchangeRate(baseCurrency);
      } catch (error) {
        throw new Error(
          `Error fetching rates for base currency : ${baseCurrency}`
        );
      }
    }
  }

  async fetchFromFixer(
    baseCurrency: string
  ): Promise<{ [key: string]: number }> {
    const url = `http://data.fixer.io/api/latest?access_key=${this.FIXER_CURRENCY_API_KEY}&base=${baseCurrency}`;

    const fixerResponse = await fetch(url).catch((error) => {
      console.error('Error fetching from Fixer API:', error);
      throw new Error('Failed to fetch data from Fixer API');
    });

    if (!fixerResponse.ok) {
      throw new Error(
        `Fixer API responded with status: ${fixerResponse.status}`
      );
    }

    const fixerData = await fixerResponse.json().catch((error) => {
      console.error('Error parsing response from Fixer API:', error);
      throw new Error('Failed to parse response from Fixer API');
    });

    if (fixerData.error && fixerData.error.code === 104) {
      throw new Error('Rate limit exceeded on Fixer API');
    }

    return fixerData.rates;
  }

  async fetchFromExchangeRate(
    baseCurrency: string
  ): Promise<{ [key: string]: number }> {
    const url = `https://v6.exchangerate-api.com/v6/${this.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`;

    const exchangeRateResponse = await fetch(url).catch((error) => {
      console.error('Error fetching from ExchangeRate API:', error);
      throw new Error('Failed to fetch data from ExchangeRate API');
    });

    if (!exchangeRateResponse.ok) {
      throw new Error(
        `ExchangeRate API responded with status: ${exchangeRateResponse.status}`
      );
    }

    const exchangeRateData = await exchangeRateResponse
      .json()
      .catch((error) => {
        console.error('Error parsing response from ExchangeRate API:', error);
        throw new Error('Failed to parse response from ExchangeRate API');
      });

    return exchangeRateData.conversion_rates;
  }

  fetchFromLocalFile(baseCurrency: string): {
    [key: string]: number;
  } {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, `../rates/${baseCurrency}.json`),
        'utf8'
      );
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to fetch from local JSON files:', error);
      throw new Error('Could not retrieve data');
    }
  }
}
