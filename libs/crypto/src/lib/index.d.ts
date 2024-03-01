interface GetHmacDigestFromTextString {
  body: string;
  secret: string;
  algorithm?: string;
}
export declare function getHmacDigestFromString({
  body,
  secret,
  algorithm,
}: GetHmacDigestFromTextString): string;
interface IsValidSignatureProps extends GetHmacDigestFromTextString {
  signature: string;
}
export declare function isValidSignature({
  signature,
  ...props
}: IsValidSignatureProps): boolean;
export declare function generateRandomAlphanumericString(
  length?: number,
): string;
export declare function generateRandomString(length?: number): string;
export declare function generateApiKeyId(apiKeyPrefix?: string): string;
export declare function hashSecret(secret: string, salt: string): string;
export declare function verifySecret(
  providedSecret: string,
  storedHashedSecret: string,
  storedSalt: string,
): boolean;
export declare function encryptSecret(secret: string): string;
export declare function decryptSecret(encryptedSecret: string): string;
export {};
