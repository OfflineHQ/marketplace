import env from '@env/server';
// TODO: replace with Web Crypto API instead of Node.js crypto (will make it work in the browser and Edge)
import {
  BinaryToTextEncoding,
  createCipheriv,
  createDecipheriv,
  createHmac,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

interface GetHmacDigestFromTextString {
  body: string;
  secret: string;
  algorithm?: string;
  encoding?: BinaryToTextEncoding;
}

export function getHmacDigestFromString({
  body,
  secret,
  algorithm = 'sha256',
  encoding = 'hex',
}: GetHmacDigestFromTextString): string {
  const hmac = createHmac(algorithm, secret);
  hmac.update(body, 'utf-8');
  return hmac.digest(encoding);
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

export function generateRandomAlphanumericString(length = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % characters.length;
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function generateRandomString(length = 32): string {
  return randomBytes(length / 2).toString('hex');
}

export function generateApiKeyId(apiKeyPrefix = ''): string {
  return `${apiKeyPrefix}${generateRandomString(32)}`;
}

export function hashSecret(secret: string, salt: string): string {
  const iterations = 100000;
  const keyLength = 64;
  const digest = 'sha512';

  return pbkdf2Sync(secret, salt, iterations, keyLength, digest).toString(
    'hex',
  );
}

export function verifySecret(
  providedSecret: string,
  storedHashedSecret: string,
  storedSalt: string,
): boolean {
  const hashedProvidedSecret = hashSecret(providedSecret, storedSalt);
  return hashedProvidedSecret === storedHashedSecret;
}

export function encryptSecret(secret: string): string {
  const iv = randomBytes(16);
  const key = Buffer.from(env.API_SECRET_ENCRYPTION_KEY);
  if (key.length !== 32) {
    throw new Error('Invalid encryption key length. Expected 32 bytes.');
  }
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(secret);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecret(encryptedSecret: string): string {
  const [ivHex, encryptedHex] = encryptedSecret.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = Buffer.from(env.API_SECRET_ENCRYPTION_KEY);

  if (key.length !== 32) {
    throw new Error('Invalid encryption key length. Expected 32 bytes.');
  }
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
