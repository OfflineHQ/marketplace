import { getHmacDigestFromString } from '@crypto';
import { BaseWebhookAndApiHandler } from './baseWebhookAndApiHandler';

describe('BaseWebhookAndApiHandler', () => {
  const integritySecret = 'test-api-secret';
  let handler: BaseWebhookAndApiHandler;

  beforeEach(() => {
    handler = new (class extends BaseWebhookAndApiHandler {})();
  });

  describe('verifySignature', () => {
    it('should return true for a valid signature in base64', () => {
      const body = 'test-body';
      const signature = getHmacDigestFromString({
        body,
        secret: integritySecret,
        algorithm: 'sha256',
        encoding: 'base64',
      });
      expect(
        handler.verifySignature({ integritySecret, body, signature }),
      ).toBe(true);
    });

    it('should return true for a valid signature in hex', () => {
      const body = 'test-body';
      const signature = getHmacDigestFromString({
        body,
        secret: integritySecret,
        algorithm: 'sha256',
        encoding: 'hex',
      });
      expect(
        handler.verifySignature({
          integritySecret,
          body,
          signature,
          encoding: 'hex',
        }),
      ).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      const body = 'test-body';
      const signature = 'invalid-signature';
      expect(
        handler.verifySignature({ integritySecret, body, signature }),
      ).toBe(false);
    });
  });

  describe('verifySignatureWithTimestamp', () => {
    it('should return true for a valid signature and timestamp', () => {
      const body = 'test-body';
      const timestamp = Math.floor(Date.now()).toString();
      const timestampedBody = `${body}|${timestamp}`;
      const signature = getHmacDigestFromString({
        body: timestampedBody,
        secret: integritySecret,
        algorithm: 'sha256',
        encoding: 'base64',
      });
      expect(
        handler.verifySignatureWithTimestamp({
          integritySecret,
          body,
          signature,
          timestamp,
        }),
      ).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      const body = 'test-body';
      const timestamp = Math.floor(Date.now()).toString();
      const signature = 'invalid-signature';
      expect(
        handler.verifySignatureWithTimestamp({
          integritySecret,
          body,
          signature,
          timestamp,
        }),
      ).toBe(false);
    });

    it('should return false for an expired timestamp', () => {
      const body = 'test-body';
      const timestamp = (Math.floor(Date.now()) - 400 * 1000).toString(); // Expired timestamp
      const timestampedBody = `${body}|${timestamp}`;
      const signature = getHmacDigestFromString({
        body: timestampedBody,
        secret: integritySecret,
        algorithm: 'sha256',
      });
      expect(
        handler.verifySignatureWithTimestamp({
          integritySecret,
          body,
          signature,
          timestamp,
        }),
      ).toBe(false);
    });
  });

  describe('generateSignatureWithBody', () => {
    it('should generate a valid signature for a string body', () => {
      const body = 'test-body';
      const { signature, body: signedBody } = handler.generateSignatureWithBody(
        { body, secret: integritySecret },
      );
      expect(
        handler.verifySignature({
          integritySecret,
          body: signedBody,
          signature,
        }),
      ).toBe(true);
    });

    it('should generate a valid signature for an object body', () => {
      const body = { key: 'value' };
      const { signature, body: signedBody } = handler.generateSignatureWithBody(
        { body, secret: integritySecret },
      );
      // Convert signedBody back to object for verification
      expect(
        handler.verifySignature({
          integritySecret,
          body: JSON.stringify(body),
          signature,
        }),
      ).toBe(true);
    });
  });

  describe('generateSignatureAndTimestamp', () => {
    it('should generate a valid signature and timestamp for a string body', () => {
      const body = 'test-body';
      const {
        signature,
        timestamp,
        body: signedBody,
      } = handler.generateSignatureAndTimestamp({
        body,
        secret: integritySecret,
      });
      expect(
        handler.verifySignatureWithTimestamp({
          integritySecret,
          body: signedBody,
          signature,
          timestamp,
        }),
      ).toBe(true);
    });
    it('should generate a valid signature and timestamp for an object body', () => {
      const body = { key: 'value' };
      const {
        signature,
        timestamp,
        body: signedBody,
      } = handler.generateSignatureAndTimestamp({
        body,
        secret: integritySecret,
      });
      // Convert signedBody back to object for verification
      expect(
        handler.verifySignatureWithTimestamp({
          integritySecret,
          body: JSON.stringify(body),
          signature,
          timestamp,
        }),
      ).toBe(true);
    });
  });
  describe('deserializeParams', () => {
    it('should deserialize a single JSON object string', () => {
      const params = { obj: '{"key":"value"}' };
      const deserialized = handler.deserializeParams(params);
      expect(deserialized).toEqual({ obj: { key: 'value' } });
    });

    it('should deserialize an array of JSON object strings', () => {
      const params = { arr: ['{"key1":"value1"}', '{"key2":"value2"}'] };
      const deserialized = handler.deserializeParams(params);
      expect(deserialized).toEqual({
        arr: [{ key1: 'value1' }, { key2: 'value2' }],
      });
    });

    it('should return the original string for non-JSON strings', () => {
      const params = { str: 'non-json-string' };
      const deserialized = handler.deserializeParams(params);
      expect(deserialized).toEqual({ str: 'non-json-string' });
    });

    it('should handle arrays with mixed content', () => {
      const params = { mixed: ['{"key":"value"}', 'non-json-string'] };
      const deserialized = handler.deserializeParams(params);
      expect(deserialized).toEqual({
        mixed: [{ key: 'value' }, 'non-json-string'],
      });
    });

    it('should handle empty strings and not throw an error', () => {
      const params = { empty: '' };
      const deserialized = handler.deserializeParams(params);
      expect(deserialized).toEqual({ empty: '' });
    });
  });
  describe('guardRequestTimestamp', () => {
    it('should not throw an error for a timestamp within the allowed range', () => {
      const timestamp = Math.floor(Date.now()).toString();
      expect(() => {
        handler.guardRequestTimestamp(timestamp);
      }).not.toThrow();
    });

    it('should throw an error for a timestamp older than the allowed range', () => {
      const timestamp = (Math.floor(Date.now()) - 400 * 1000).toString(); // 400 seconds ago in milliseconds
      expect(() => {
        handler.guardRequestTimestamp(timestamp);
      }).toThrow('Timestamp is older than 3 minutes');
    });

    it('should throw an error if timestamp is not provided', () => {
      expect(() => {
        handler.guardRequestTimestamp('');
      }).toThrow('Timestamp is required and delta must be positive');
    });

    it('should throw an error if delta is not positive', () => {
      const timestamp = Math.floor(Date.now()).toString();
      expect(() => {
        handler.guardRequestTimestamp(timestamp, -1);
      }).toThrow('Timestamp is required and delta must be positive');
    });
  });
  describe('getRequiredParam', () => {
    it('should return the value of a present parameter', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('shop', 'example.myshopify.com');
      const paramName = 'shop';
      const expectedValue = 'example.myshopify.com';

      const result = handler['getRequiredParam'](searchParams, paramName);

      expect(result).toBe(expectedValue);
    });

    it('should throw an error if the parameter is missing', () => {
      const searchParams = new URLSearchParams();
      const paramName = 'missingParam';

      expect(() => {
        handler['getRequiredParam'](searchParams, paramName);
      }).toThrowError(`Missing ${paramName}`);
    });

    it('should throw an error if the parameter value is empty', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('emptyParam', '');
      const paramName = 'emptyParam';

      expect(() => {
        handler['getRequiredParam'](searchParams, paramName);
      }).toThrowError(`Missing ${paramName}`);
    });
  });
});
