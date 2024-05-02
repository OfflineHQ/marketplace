import env from '@env/server';

interface IsValidSigResponse {
  success: boolean;
  result: boolean;
}

export class SmartWallet {
  private readonly baseURL: string;
  constructor() {
    this.baseURL = 'https://api.connect.cometh.io';
  }
  // https://api.connect.cometh.io/doc#tag/Wallets/operation/isValidSignature
  public async isValidSignature({
    message,
    signature,
    address,
  }: {
    message: string;
    signature: string;
    address: string;
  }): Promise<boolean> {
    const response = await fetch(
      `${this.baseURL}/wallets/${address}/is-valid-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.COMETH_CONNECT_API_KEY,
        },
        body: JSON.stringify({
          message,
          signature,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const res = await response.json();
    const { success, result } = res as IsValidSigResponse;
    if (!success) {
      throw new Error('API call failed');
    }
    return result;
  }
}
