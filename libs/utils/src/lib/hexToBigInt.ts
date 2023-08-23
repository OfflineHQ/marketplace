/**
 * Converts a given hexadecimal string to a BigInt.
 * @param hex Hexadecimal string to be converted.
 * @returns A BigInt representation of the hexadecimal string.
 */
export const hexToBigInt = (hex: string): bigint => {
  if (typeof hex !== 'string') {
    throw new TypeError('Input must be a string.');
  }

  if (!/^0x[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('Invalid hexadecimal string.');
  }

  return BigInt(hex);
};
