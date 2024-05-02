import { interpolateString } from './index';

describe('interpolateString', () => {
  const locale = 'en';
  it('should interpolate string with provided values', () => {
    const str = 'Hello, {name}! You have {count, number} unread messages.';
    const values = { name: 'John', count: 5 };
    const result = interpolateString(str, locale, values);
    expect(result).toBe('Hello, John! You have 5 unread messages.');
  });

  it('should handle missing values gracefully', () => {
    const str = 'Hello, {name}! You have {count, number} unread messages.';
    const values = { name: 'John' };
    const result = interpolateString(str, locale, values);
    expect(result).toBe(str);
  });

  it('should handle no values to interpolate', () => {
    const str = 'Hello, ! You have unread messages.';
    const result = interpolateString(str, locale);
    expect(result).toBe(str);
  });

  it('should interpolate string with provided values and bypass the one that is not provided in string', () => {
    const str = 'Hello, {name}! You have 10 unread messages.';
    const values = { name: 'John', count: 5 };
    const result = interpolateString(str, locale, values);
    expect(result).toBe('Hello, John! You have 10 unread messages.');
  });

  it('should support custom formats', () => {
    const str = 'The current date is {now, date, long}.';
    const values = { now: new Date('2023-06-10') };
    const formats = {
      date: {
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      },
    };
    const result = interpolateString(str, locale, values, formats);
    expect(result).toBe('The current date is June 10, 2023.');
  });

  it('should handle formatting errors gracefully', () => {
    const str = 'Invalid format: {value, invalid}';
    const values = { value: 42 };
    const result = interpolateString(str, locale, values);
    expect(result).toBe('Invalid format: {value, invalid}');
  });

  it('should format with default options', () => {
    const str = 'The price is {price, number, ::currency/USD}';
    const values = { price: 19.99 };
    const result = interpolateString(str, locale, values);
    expect(result).toBe('The price is $19.99');
  });

  it('should format with different languages', () => {
    const str = 'The date is {date, date, long}';
    const values = { date: new Date('2023-06-10') };
    const resultEn = interpolateString(str, locale, values);
    expect(resultEn).toBe('The date is June 10, 2023');

    const resultFr = interpolateString(str, 'fr', values);
    expect(resultFr).toBe('The date is 10 juin 2023');
  });
});
