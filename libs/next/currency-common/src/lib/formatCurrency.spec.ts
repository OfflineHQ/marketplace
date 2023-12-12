import { Money } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { cookies } from 'next/headers';
import { formatCurrency } from './formatCurrency';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('formatCurrency', () => {
  beforeEach(() => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'EUR' }),
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  // Returns a formatted currency string when given valid inputs
  it('should return a formatted currency string when given valid inputs', () => {
    const format = {
      number: jest.fn(),
    };
    const money = {
      amount: 1200,
      currency: Currency_Enum.Usd,
    };
    const rates = {
      USD: {
        EUR: 0.85,
      },
    };

    formatCurrency(format, money, rates);

    expect(format.number).toHaveBeenCalledWith('10.200000', {
      style: 'currency',
      currency: Currency_Enum.Eur,
    });
  });

  // Uses EUR as default currency when none is provided
  it('should use EUR as default currency when none is provided', () => {
    const format = {
      number: jest.fn(),
    };
    const money = {
      amount: 10,
    };
    const rates = {
      USD: {
        EUR: 0.85,
      },
    };

    formatCurrency(format, money, rates);

    expect(format.number).toHaveBeenCalledWith('0.10', {
      style: 'currency',
      currency: Currency_Enum.Eur,
    });
  });

  // Uses 0 as default amount when none is provided
  it('should use 0 as default amount when none is provided', () => {
    const format = {
      number: jest.fn(),
    };
    const money = {
      currency: Currency_Enum.Usd,
    };
    const rates = {
      USD: {
        EUR: 0.85,
      },
    };

    formatCurrency(format, money as Money, rates);

    expect(format.number).toHaveBeenCalledWith('0.000000', {
      style: 'currency',
      currency: Currency_Enum.Eur,
    });
  });

  // Returns undefined when money is undefined
  it('should return undefined when money is undefined', () => {
    const format = {
      number: jest.fn(),
    };
    const money = undefined;
    const rates = {
      USD: {
        EUR: 0.85,
      },
    };

    const result = formatCurrency(format, money, rates);

    expect(result).toBeUndefined();
  });

  // Returns undefined when rates is undefined
  it('should return undefined when rates is undefined', () => {
    const format = {
      number: jest.fn(),
    };
    const money = {
      amount: 10,
      currency: Currency_Enum.Usd,
    };
    const rates = undefined;

    const result = formatCurrency(format, money, rates as any);

    expect(result).toBeUndefined();
  });
});
