import { hexToBigInt } from './hexToBigInt';

describe('hexToBigInt', () => {
  it('should convert a valid hexadecimal string to a BigInt', () => {
    const hex = '0x78b94e';
    const result = hexToBigInt(hex);
    expect(result).toBe(BigInt(7911758));
  });

  it('should throw an error for an invalid hexadecimal string', () => {
    const invalidHex = 'invalidHex';
    expect(() => hexToBigInt(invalidHex)).toThrow(
      'Invalid hexadecimal string.'
    );
  });

  it('should throw a TypeError for a non-string input', () => {
    // @ts-ignore
    expect(() => hexToBigInt(12345)).toThrow('Input must be a string.');
  });
});
