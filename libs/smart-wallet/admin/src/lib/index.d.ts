export declare class SmartWallet {
  private readonly baseURL;
  constructor();
  isValidSignature({
    message,
    signature,
    address,
  }: {
    message: string;
    signature: string;
    address: string;
  }): Promise<boolean>;
}
