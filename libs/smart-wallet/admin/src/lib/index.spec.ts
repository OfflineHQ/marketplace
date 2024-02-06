import env from '@env/server';
import { SmartWallet } from './index';

describe('SmartWallet', () => {
  let fetchMock;
  const message = 'valid message';
  const signature = 'valid signature';
  const address = 'valid address';
  beforeAll(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });
  beforeEach(() => {
    fetchMock.mockClear();
  });
  it('should call fetch with the right parameters', async () => {
    const smartWallet = new SmartWallet();
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true, result: true }),
    });

    await smartWallet.isValidSignature({
      message,
      signature,
      address,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.connect.cometh.io/wallets/${address}/is-valid-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.COMETH_CONNECT_API_KEY,
        },
        body: JSON.stringify({ message, signature }),
      },
    );
  });
  it('should handle API response with success: true and result: true', async () => {
    const smartWallet = new SmartWallet();
    // Mock the fetch function to return a successful response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true, result: true }),
    });

    const result = await smartWallet.isValidSignature({
      message,
      signature,
      address,
    });

    expect(result).toBe(true);
  });

  it('should handle API response with success: true and result: false', async () => {
    const smartWallet = new SmartWallet();
    const message = 'valid message';
    const signature = 'valid signature';
    const address = 'valid address';

    // Mock the fetch function to return a failed response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true, result: false }),
    });

    const result = await smartWallet.isValidSignature({
      message,
      signature,
      address,
    });

    expect(result).toBe(false);
  });

  // isValidSignature throws an error when the API call fails
  it('should throw an error when the API call fails', async () => {
    const smartWallet = new SmartWallet();
    const message = 'valid message';
    const signature = 'valid signature';
    const address = 'valid address';

    // Mock the fetch function to return a failed response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(
      smartWallet.isValidSignature({ message, signature, address }),
    ).rejects.toThrowError('API call failed with status: 500');
  });
});
