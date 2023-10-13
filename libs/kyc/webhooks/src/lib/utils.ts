import { isValidSignature } from '@crypto';
import type { SumsubRequest } from '@kyc/types';

export function isValidSignatureForSumsubRequest(
  request: SumsubRequest,
  signingKey: string,
): boolean {
  return isValidSignatureForStringBody(
    request.sumsub.rawBody,
    request.sumsub.signature,
    signingKey,
  );
}

export function isValidSignatureForStringBody(
  body: string,
  signature: string,
  signingKey: string,
): boolean {
  return isValidSignature({
    string: body,
    secret: signingKey,
    signature,
    algorithm: 'sha1',
  });
}

export function addSumsubContextToRequest(
  req: SumsubRequest,
  body: string,
  signature: string,
): void {
  req.sumsub = {
    rawBody: body,
    signature,
  };
}
