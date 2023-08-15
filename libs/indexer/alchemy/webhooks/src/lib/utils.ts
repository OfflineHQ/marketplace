import * as crypto from 'crypto';
import type { AlchemyRequest } from './types';

export function isValidSignatureForAlchemyRequest(
  request: AlchemyRequest,
  signingKey: string
): boolean {
  return isValidSignatureForStringBody(
    request.alchemy.rawBody,
    request.alchemy.signature,
    signingKey
  );
}

export function isValidSignatureForStringBody(
  body: string,
  signature: string,
  signingKey: string
): boolean {
  const hmac = crypto.createHmac('sha256', signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body, 'utf8'); // Update the token hash with the request body using utf8
  const digest = hmac.digest('hex');
  return signature === digest;
}

export function addAlchemyContextToRequest(
  req: AlchemyRequest,
  body: string,
  signature: string
): void {
  req.alchemy = {
    rawBody: body,
    signature,
  };
}
