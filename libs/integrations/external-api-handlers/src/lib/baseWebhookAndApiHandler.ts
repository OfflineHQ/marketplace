import { getHmacDigestFromString, isValidSignature } from '@crypto';
import { isOriginAllowed } from '@utils';
import { timingSafeEqual } from 'crypto';

interface VerifySignatureProps {
  integritySecret: string;
  body: string;
  signature: string;
}

interface VerifySignatureWithTimestampProps extends VerifySignatureProps {
  timestamp: string;
}

interface GenerateSignatureProps {
  body: string | object;
  secret: string;
}

export abstract class BaseWebhookAndApiHandler {
  verifySignature({
    integritySecret,
    body,
    signature,
  }: VerifySignatureProps): boolean {
    return isValidSignature({
      algorithm: 'sha256',
      body,
      secret: integritySecret,
      signature,
      encoding: 'base64',
    });
  }

  verifySignatureWithTimestamp({
    integritySecret,
    body,
    signature,
    timestamp,
  }: VerifySignatureWithTimestampProps): boolean {
    // Validate the timestamp
    try {
      this.guardRequestTimestamp(timestamp, 300); // 5 minutes in seconds as the allowed time difference
    } catch (error) {
      return false;
    }
    const timestampedBody = `${body}|${timestamp}`; // Reconstruct the timestampedBody as it was during signature generation
    const expectedSignature = getHmacDigestFromString({
      body: timestampedBody,
      secret: integritySecret,
      algorithm: 'sha256',
    });
    return (
      Buffer.byteLength(signature) === Buffer.byteLength(expectedSignature) &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    );
  }

  // Function to deserialize any serialized objects within the parameters
  deserializeParams(params: { [key: string]: string | string[] }) {
    const deserializedParams: { [key: string]: any } = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        // Process each element in the array individually
        deserializedParams[key] = value.map((v) => {
          try {
            // Attempt to parse each element as JSON
            return JSON.parse(v);
          } catch (error) {
            // If parsing fails, it's not a serialized object, so keep the original value
            return v;
          }
        });
      } else {
        try {
          // Attempt to parse the value as JSON
          deserializedParams[key] = JSON.parse(value);
        } catch (error) {
          // If parsing fails, it's not a serialized object, so keep the original value
          deserializedParams[key] = value;
        }
      }
    });
    return deserializedParams;
  }

  /**
   * Generates a HMAC signature for the given body and appends a timestamp.
   * @param {string | object} body - The request body to be signed.
   * @param {string} secret - The secret used for generating the HMAC signature.
   * @returns { signature: string, timestampedBody: string } - The signature and the body with a timestamp.
   */
  generateSignatureWithBody({ body, secret }: GenerateSignatureProps): {
    signature: string;
    body: string;
  } {
    const bodyString = typeof body === 'object' ? JSON.stringify(body) : body;

    const signature = getHmacDigestFromString({
      body: bodyString,
      secret,
      algorithm: 'sha256',
    });

    return { signature, body: bodyString };
  }

  generateSignatureAndTimestamp({ body, secret }: GenerateSignatureProps): {
    signature: string;
    timestamp: string;
    body: string;
  } {
    const timestamp = Math.floor(Date.now()).toString();
    const bodyString = typeof body === 'object' ? JSON.stringify(body) : body;
    const timestampedBody = `${bodyString}|${timestamp}`; // Combine for signature generation

    const signature = getHmacDigestFromString({
      body: timestampedBody,
      secret,
      algorithm: 'sha256',
    });

    // Note: Send the original body, this signature, and the timestamp in your request
    return { signature, timestamp, body: bodyString };
  }

  guardRequestTimestamp(timestamp: string, deltaInSeconds = 180) {
    if (!timestamp || deltaInSeconds <= 0) {
      throw new Error('Timestamp is required and delta must be positive');
    }
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    if (
      Math.abs(
        timestampInSeconds - Math.floor(parseInt(timestamp, 10) / 1000),
      ) > deltaInSeconds
    ) {
      throw new Error(`Timestamp is older than ${deltaInSeconds / 60} minutes`);
    }
  }
  guardAllowListOrigin(allowlist: string, origin: string) {
    if (!isOriginAllowed(allowlist, origin)) {
      throw new Error(`Origin ${origin} is not allowed.`);
    }
  }
  getRequiredParam(searchParams: URLSearchParams, paramName: string): string {
    const paramValue = searchParams.get(paramName);
    if (!paramValue) {
      throw new Error(`Missing ${paramName}`);
    }
    return paramValue;
  }
}
