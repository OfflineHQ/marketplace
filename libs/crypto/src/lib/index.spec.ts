import { getHmacDigestFromString, isValidSignature } from './index';

describe('Crypto library', () => {
  describe('getHmacDigestFromString', () => {
    it('should return correct HMAC digest', () => {
      const result = getHmacDigestFromString({
        string: 'test',
        secret: 'secret',
      });
      expect(result).toBe(
        '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914'
      );
    });
    it('should return correct HMAC digest with SHA1', () => {
      const result = getHmacDigestFromString({
        string: 'test',
        secret: 'secret',
        algorithm: 'sha1',
      });
      // Replace with the correct SHA1 HMAC digest for 'test' string and 'secret' secret
      expect(result).toBe('1aa349585ed7ecbd3b9c486a30067e395ca4b356');
    });

    it('should throw error for invalid algorithm', () => {
      expect(() => {
        getHmacDigestFromString({
          string: 'test',
          secret: 'secret',
          algorithm: 'invalid',
        });
      }).toThrow();
    });
  });

  describe('isValidSignature', () => {
    it('should return true for valid signature', () => {
      const result = isValidSignature({
        string: 'test',
        secret: 'secret',
        signature:
          '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
      });
      expect(result).toBe(true);
    });

    it('should return false for valid signature but wrong algorithm', () => {
      const result = isValidSignature({
        string: 'test',
        secret: 'secret',
        signature:
          '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
        algorithm: 'sha1',
      });
      expect(result).toBe(false);
    });

    it('should return false for invalid signature', () => {
      const result = isValidSignature({
        string: 'test',
        secret: 'secret',
        signature: 'invalid',
      });
      expect(result).toBe(false);
    });

    it('should throw error for wrong algorithm', () => {
      expect(() =>
        isValidSignature({
          string: 'test',
          secret: 'secret',
          signature:
            '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
          algorithm: 'fake',
        })
      ).toThrow();
    });
  });
});
