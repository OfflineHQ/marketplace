import { truncateString, truncateEmailString } from './index';

describe('truncateString', () => {
  test('should throw error when maxChars is less than 5', () => {
    expect(() => {
      truncateString('Hello, world!', 4);
    }).toThrow(
      'maxChars must be at least 5 to allow proper truncation with three asterisks (***)'
    );
  });

  test('should return original string when length is less than or equal to maxChars', () => {
    const originalString = 'Hello!';
    expect(truncateString(originalString, 6)).toBe(originalString);
  });

  test('should truncate string with three asterisks', () => {
    const originalString = 'This is a long string to be truncated';
    expect(truncateString(originalString, 12)).toBe('This***cated');
  });

  test('should truncate string with odd maxChars', () => {
    const originalString = 'This is a long string to be truncated';
    expect(truncateString(originalString, 13)).toBe('This ***cated');
  });

  test('should truncate string with even maxChars', () => {
    const originalString = 'This is a long string to be truncated';
    expect(truncateString(originalString, 14)).toBe('This ***ncated');
  });
});

describe('truncateEmailString', () => {
  test('should throw error when input is not a valid email', () => {
    expect(() => {
      truncateEmailString('invalid-email', 10);
    }).toThrow('Invalid email format');
  });

  test('should return original email when length is less than or equal to maxChars', () => {
    const originalEmail = 'johndoe@example.com';
    expect(truncateEmailString(originalEmail, 19)).toBe(originalEmail);
  });

  test('should truncate email', () => {
    const originalEmail = 'johndoe@example.com';
    expect(truncateEmailString(originalEmail, 16)).toBe('j***@example.com');
  });

  test('should truncate email with long domain', () => {
    const originalEmail = 'johndoe@verylongdomainexample.com';
    expect(truncateEmailString(originalEmail, 24)).toBe(
      'jo***@verylongdomainexample.com'
    );
  });
});
