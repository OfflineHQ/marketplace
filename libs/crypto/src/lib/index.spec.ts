import {
  generateApiKeyId,
  generateRandomAlphanumericString,
  getHmacDigestFromString,
  hashSecret,
  isValidSignature,
  verifySecret,
} from './index';

describe('Crypto library', () => {
  describe('getHmacDigestFromString', () => {
    it('should return correct HMAC digest', () => {
      const result = getHmacDigestFromString({
        body: 'test',
        secret: 'secret',
      });
      expect(result).toBe(
        '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
      );
    });
    it('should return correct HMAC digest with SHA1', () => {
      const result = getHmacDigestFromString({
        body: 'test',
        secret: 'secret',
        algorithm: 'sha1',
      });
      // Replace with the correct SHA1 HMAC digest for 'test' string and 'secret' secret
      expect(result).toBe('1aa349585ed7ecbd3b9c486a30067e395ca4b356');
    });

    it('should throw error for invalid algorithm', () => {
      expect(() => {
        getHmacDigestFromString({
          body: 'test',
          secret: 'secret',
          algorithm: 'invalid',
        });
      }).toThrow();
    });
  });

  describe('isValidSignature', () => {
    it('should return true for valid signature', () => {
      const result = isValidSignature({
        body: 'test',
        secret: 'secret',
        signature:
          '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
      });
      expect(result).toBe(true);
    });

    it('should return false for valid signature but wrong algorithm', () => {
      const result = isValidSignature({
        body: 'test',
        secret: 'secret',
        signature:
          '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
        algorithm: 'sha1',
      });
      expect(result).toBe(false);
    });

    it('should return false for invalid signature', () => {
      const result = isValidSignature({
        body: 'test',
        secret: 'secret',
        signature: 'invalid',
      });
      expect(result).toBe(false);
    });

    it('should throw error for wrong algorithm', () => {
      expect(() =>
        isValidSignature({
          body: 'test',
          secret: 'secret',
          signature:
            '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914',
          algorithm: 'fake',
        }),
      ).toThrow();
    });
  });
  describe('generateRandomAlphanumericString', () => {
    it('should generate a random string with default length', () => {
      const result = generateRandomAlphanumericString();
      expect(result).toHaveLength(6);
      expect(result).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate a random string with specified length', () => {
      const length = 10;
      const result = generateRandomAlphanumericString(length);
      expect(result).toHaveLength(length);
      expect(result).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate different random strings on each call', () => {
      const result1 = generateRandomAlphanumericString();
      const result2 = generateRandomAlphanumericString();
      expect(result1).not.toBe(result2);
    });
  });
  describe('generateApiKeyId', () => {
    it('should generate an API key ID with default no prefix', () => {
      const result = generateApiKeyId();
      expect(result).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should generate an API key ID with custom prefix', () => {
      const prefix = 'custom_';
      const result = generateApiKeyId(prefix);
      expect(result).toMatch(new RegExp(`^${prefix}[a-f0-9]{32}$`));
    });

    it('should generate different API key IDs on each call', () => {
      const result1 = generateApiKeyId();
      const result2 = generateApiKeyId();
      expect(result1).not.toBe(result2);
    });
  });

  describe('hashSecret and verifySecret', () => {
    it('should hash and verify secret correctly', () => {
      const secret = 'my-secret';
      const salt = 'random-salt';

      const hashedSecret = hashSecret(secret, salt);
      expect(hashedSecret).not.toBe(secret);

      const isValid = verifySecret(secret, hashedSecret, salt);
      expect(isValid).toBe(true);
    });

    it('should return false when verifying with wrong secret', () => {
      const secret = 'my-secret';
      const wrongSecret = 'wrong-secret';
      const salt = 'random-salt';

      const hashedSecret = hashSecret(secret, salt);

      const isValid = verifySecret(wrongSecret, hashedSecret, salt);
      expect(isValid).toBe(false);
    });

    it('should return false when verifying with wrong salt', () => {
      const secret = 'my-secret';
      const salt = 'random-salt';
      const wrongSalt = 'wrong-salt';

      const hashedSecret = hashSecret(secret, salt);

      const isValid = verifySecret(secret, hashedSecret, wrongSalt);
      expect(isValid).toBe(false);
    });
  });
});
