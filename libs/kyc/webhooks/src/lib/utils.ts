import { isValidSignature } from '@crypto';
import type { SumsubRequest } from '@kyc/types';

export function isValidSignatureForSumsubRequest(
  request: SumsubRequest,
  activityWebhookSigningKey: string,
): boolean {
  return isValidSignatureForStringBody(
    request.sumsub.rawBody,
    request.sumsub.signature,
    activityWebhookSigningKey,
  );
}

export function isValidSignatureForStringBody(
  body: string,
  signature: string,
  activityWebhookSigningKey: string,
): boolean {
  return isValidSignature({
    body,
    secret: activityWebhookSigningKey,
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
