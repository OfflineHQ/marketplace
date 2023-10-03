import { Currency_Enum_Not_Const } from '@currency/types';
import { kv } from '@vercel/kv';
import { getRate, getRates, setRate, setRates } from './next-currency-cache';

describe('nextCurrencyCache', () => {
  it('should set rate', async () => {
    await kv.flushall();
    console.log(await setRate(Currency_Enum_Not_Const.EUR));
    await getRate(Currency_Enum_Not_Const.EUR);
    console.log(await kv.keys('*'));
  }, 20000);

  it('should set rates', async () => {
    await kv.flushall();
    console.log(await setRates());
    console.log(await getRates());
    console.log(await kv.keys('*'));
  }, 20000);
});
