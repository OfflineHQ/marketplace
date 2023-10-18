import {
  truncateString,
  truncateEmailString,
  deepPick,
  deepMerge,
} from './index';

describe('truncateString', () => {
  test('should throw error when maxChars is less than 5', () => {
    expect(() => {
      truncateString('Hello, world!', 4);
    }).toThrow(
      'maxChars must be at least 5 to allow proper truncation with three asterisks (***)',
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
    const originalEmail = 'johnny.doeyeydodidooooo@example.com';
    expect(truncateEmailString(originalEmail, 12)).toBe(
      'john***ooooo@example.com',
    );
  });

  test('should not truncate email with long domain', () => {
    const originalEmail = 'jonhdoe@verylongdomainexample.com';
    expect(truncateEmailString(originalEmail, 24)).toBe(
      'jonhdoe@verylongdomainexample.com',
    );
  });
});

describe('deepMerge', () => {
  it('should correctly merge flat objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = deepMerge(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should correctly merge nested objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } };
    const obj2 = { b: { d: 4, e: 5 }, f: 6 };
    const result = deepMerge(obj1, obj2);
    expect(result).toEqual({ a: 1, b: { c: 2, d: 4, e: 5 }, f: 6 });
  });

  it('should not mutate the original objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const obj1Copy = { ...obj1 };
    const obj2Copy = { ...obj2 };
    deepMerge(obj1, obj2);
    expect(obj1).toEqual(obj1Copy);
    expect(obj2).toEqual(obj2Copy);
  });
});

describe('deepPick', () => {
  const messages = {
    Organizer: {
      EventDates: {
        StartDate: {
          Time: 'Start Time',
        },
        EndDate: 'End Date',
      },
    },
  };
  it('should correctly pick the top-level object', () => {
    const result = deepPick(messages, ['Organizer']);
    expect(result).toEqual(messages);
  });
  it('should correctly pick the nested object', () => {
    const result = deepPick(messages, ['Organizer.EventDates.StartDate.Time']);
    expect(result).toEqual({
      Organizer: {
        EventDates: {
          StartDate: {
            Time: 'Start Time',
          },
        },
      },
    });
  });

  it('should return undefined for non-existent paths', () => {
    const result = deepPick(messages, ['NonExistent.Path' as any]);
    expect(result).toEqual({
      NonExistent: undefined,
    });
  });

  it('should handle multiple paths', () => {
    const result = deepPick(messages, [
      'Organizer.EventDates.StartDate',
      'Organizer.EventDates.EndDate',
    ]);
    expect(result).toEqual({
      Organizer: {
        EventDates: {
          StartDate: {
            Time: 'Start Time',
          },
          EndDate: 'End Date',
        },
      },
    });
  });
});
