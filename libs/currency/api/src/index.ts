import { Currency_Enum_Not_Const } from '@currency/types';
import env from '@env/server';
import { isPreviewOrProduction } from '@shared/server';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export class Currency {
  supportedCurrencies: string;

  constructor() {
    this.supportedCurrencies = Object.values(Currency_Enum_Not_Const).join(',');
  }
  async getRate(baseCurrency: string): Promise<{ [key: string]: number }> {
    if (!isPreviewOrProduction()) {
      return await this.fetchFromLocalFile(baseCurrency);
    }
    try {
      // await this.saveToLocalFile(baseCurrency, rates);
      return await this.fetchFromAPI(
        `http://data.fixer.io/api/latest?access_key=${env.FIXER_CURRENCY_API_KEY}&base=${baseCurrency}&symbols=${this.supportedCurrencies}`,
        'Fixer',
      );
    } catch (error) {
      console.warn('Falling back to ExchangeRate API');
      try {
        // await this.saveToLocalFile(baseCurrency, rates);
        return await this.fetchFromAPI(
          `https://v6.exchangerate-api.com/v6/${env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`,
          'ExchangeRate',
        );
      } catch (error) {
        console.warn('Falling back to local file');
        if (!isPreviewOrProduction()) {
          return await this.fetchFromLocalFile(baseCurrency);
        } else throw error;
      }
    }
  }

  private async fetchFromAPI(
    url: string,
    apiName: string,
  ): Promise<{ [key: string]: number }> {
    const response = await fetch(url).catch((error) => {
      console.error(`Error fetching from ${apiName} API:`, error);
      throw new Error(`Failed to fetch data from ${apiName} API`);
    });

    if (!response.ok) {
      throw new Error(
        `${apiName} API responded with status: ${response.status}`,
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
        `Error for ExchangeRate api : ${data.error['error-type']}`,
      );
    }

    if (!data.rates && !data.conversion_rates) {
      throw new Error(`No rates data received from ${apiName} API`);
    }

    return apiName === 'Fixer' ? data.rates : data.conversion_rates;
  }

  async saveToLocalFile(
    baseCurrency: string,
    rates: { [key: string]: number },
  ) {
    // @ts-ignore
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, `rates/${baseCurrency}.json`);
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(rates));
    } catch (error) {
      console.error(
        `Failed to write rates for ${baseCurrency} to local file:`,
        error,
      );
      throw new Error(`Could not save rates for ${baseCurrency}`);
    }
  }

  async fetchFromLocalFile(
    baseCurrency: string,
  ): Promise<{ [key: string]: number }> {
    try {
      // here mean that we are in production build but not in production vercel (so for instance local test or e2e test)
      if (process.env.NODE_ENV === 'production') {
        const projectRoot = process.cwd(); // This points to /dist/apps/web or /dist/apps/back-office
        const filePath = path.join(
          projectRoot,
          '../../libs/currency/api/src/rates',
          `${baseCurrency}.json`,
        );
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
      } else {
        // Existing logic for non-preview or non-production environments
        // @ts-ignore
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, `rates/${baseCurrency}.json`);
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to fetch from local JSON files:', error);
      throw new Error('Could not retrieve data');
    }
  }
}
