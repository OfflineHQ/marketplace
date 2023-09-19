import { createHmac } from 'crypto';

interface GetHmacDigestFromTextString {
  string: string;
  secret: string;
  algorithm?: string;
}

export function getHmacDigestFromString({
  string,
  secret,
  algorithm = 'sha256',
}: GetHmacDigestFromTextString): string {
  const hmac = createHmac(algorithm, secret);
  hmac.update(string, 'utf-8');
  return hmac.digest('hex');
}

interface IsValidSignatureProps extends GetHmacDigestFromTextString {
  signature: string;
}

export function isValidSignature({
  signature,
  ...props
}: IsValidSignatureProps): boolean {
  return signature === getHmacDigestFromString(props);
}
