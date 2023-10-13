import { isValidSignature } from '@crypto';
import type { AlchemyRequest } from '@indexer/alchemy/types';

export function isValidSignatureForAlchemyRequest(
  request: AlchemyRequest,
  signingKey: string,
): boolean {
  return isValidSignatureForStringBody(
    request.alchemy.rawBody,
    request.alchemy.signature,
    signingKey,
  );
}

export function isValidSignatureForStringBody(
  body: string,
  signature: string,
  signingKey: string,
): boolean {
  return isValidSignature({ string: body, secret: signingKey, signature });
}

export function addAlchemyContextToRequest(
  req: AlchemyRequest,
  body: string,
  signature: string,
): void {
  req.alchemy = {
    rawBody: body,
    signature,
  };
}
