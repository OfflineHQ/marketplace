import { isPreviewOrProduction } from '@shared/server';
import * as fs from 'fs';
import * as path from 'path';

export default class Currency {
  private FIXER_CURRENCY_API_KEY = process.env.FIXER_CURRENCY_API_KEY;
  private EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  async getRate(baseCurrency: string): Promise<{ [key: string]: number }> {
    if (!isPreviewOrProduction()) {
      return await this.fetchFromLocalFile(baseCurrency);
    }
    try {
      const rates = await this.fetchFromAPI(
        `http://data.fixer.io/api/latest?access_key=${this.FIXER_CURRENCY_API_KEY}&base=${baseCurrency}`,
        'Fixer'
      );
      await this.saveToLocalFile(baseCurrency, rates);
      return rates;
    } catch (error) {
      console.warn('Falling back to ExchangeRate API');
      try {
        const rates = await this.fetchFromAPI(
          `https://v6.exchangerate-api.com/v6/${this.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`,
          'ExchangeRate'
        );
        await this.saveToLocalFile(baseCurrency, rates);
        return rates;
      } catch (error) {
        console.warn('Falling back to local file');
        return await this.fetchFromLocalFile(baseCurrency);
      }
    }
  }

  private async fetchFromAPI(
    url: string,
    apiName: string
  ): Promise<{ [key: string]: number }> {
    const response = await fetch(url).catch((error) => {
      console.error(`Error fetching from ${apiName} API:`, error);
      throw new Error(`Failed to fetch data from ${apiName} API`);
    });

    if (!response.ok) {
      throw new Error(
        `${apiName} API responded with status: ${response.status}`
      );
    }

    const data = await response.json().catch((error) => {
      console.error(`Error parsing response from ${apiName} API:`, error);
      throw new Error(`Failed to parse response from ${apiName} API`);
    });

    if (data.error && data.error.code === 104) {
      throw new Error('Rate limit exceeded on Fixer API');
    }

    if (data.error && data.error['error-type']) {
      throw new Error(
        `Error for ExchangeRate api : ${data.error['error-type']}`
      );
    }

    if (!data.rates && !data.conversion_rates) {
      throw new Error(`No rates data received from ${apiName} API`);
    }

    return apiName === 'Fixer' ? data.rates : data.conversion_rates;
  }

  async saveToLocalFile(
    baseCurrency: string,
    rates: { [key: string]: number }
  ) {
    const filePath = path.join(process.cwd(), 'rates', `${baseCurrency}.json`);
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(rates));
    } catch (error) {
      console.error(
        `Failed to write rates for ${baseCurrency} to local file:`,
        error
      );
      throw new Error(`Could not save rates for ${baseCurrency}`);
    }
  }

  async fetchFromLocalFile(baseCurrency: string): Promise<{
    [key: string]: number;
  }> {
    try {
      const filePath = path.join(
        process.cwd(),
        'rates',
        `${baseCurrency}.json`
      );
      const data = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to fetch from local JSON files:', error);
      throw new Error('Could not retrieve data');
    }
  }
}
