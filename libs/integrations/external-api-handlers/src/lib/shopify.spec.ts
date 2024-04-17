import { decryptSecret } from '@crypto';
import { adminSdk } from '@gql/admin/api';
import { ApiKeyType_Enum } from '@gql/shared/types';
import { getSecretApiKey } from '@integrations/api-keys';
import {
  BadRequestError,
  InternalServerError,
  NotAuthorizedError,
  NotFoundError,
} from '@next/api-handler';
import { getCurrentChain } from '@next/chains';
import { LoyaltyCardNftWrapper } from '@nft/loyalty-card';
import { NextRequest } from 'next/server';
import { MintLoyaltyCardOptions, ShopifyWebhookAndApiHandler } from './shopify';

jest.mock('@integrations/api-keys');
jest.mock('@crypto');
jest.mock('@nft/loyalty-card', () => ({
  LoyaltyCardNftWrapper: jest.fn().mockImplementation(() => ({
    mintWithPassword: jest.fn(),
  })),
}));
jest.mock('@gql/admin/api');
jest.mock('@next/chains', () => ({
  getCurrentChain: () => ({
    chainIdHex: '0x1',
  }),
}));

// Mock the headers function to return the mock Headers object
jest.mock('next/headers', () => ({
  headers: () =>
    new Headers({
      'x-shopify-client-id': 'validApiKey',
    }),
}));

describe('ShopifyWebhookAndApiHandler', () => {
  let handler: ShopifyWebhookAndApiHandler;
  let mockRequest: NextRequest;
  let verifySignatureMock: jest.SpyInstance;

  beforeEach(() => {
    handler = new ShopifyWebhookAndApiHandler();
    verifySignatureMock = jest.spyOn(handler, 'verifySignature');
    mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({
          shop: 'example.myshopify.com',
          timestamp: (Date.now() - 10).toString(), // recent timestamp
          signature: 'validSignature',
          dummy: 'dummy',
          dummyArray: JSON.stringify(['dummy1', 'dummy2']),
          dummyObject: JSON.stringify({ key: 'value' }),
        }),
      },
      headers: new Headers({
        'x-shopify-client-id': 'validApiKey',
      }),
    } as unknown as NextRequest;

    (getSecretApiKey as jest.Mock).mockResolvedValue({
      type: ApiKeyType_Enum.Shopify,
      encryptedIntegritySecret: 'encryptedSecret',
      allowlist: 'https://example.myshopify.com',
      organizerId: 'org123',
    });

    (decryptSecret as jest.Mock).mockReturnValue('decryptedSecret');
  });

  describe('extractAndVerifyShopifyRequest', () => {
    it('should call verifySignature with correct arguments and handle correct of signature', async () => {
      verifySignatureMock.mockReturnValue(true);

      const res = await handler.extractAndVerifyShopifyRequest(mockRequest);

      expect(res).toBeDefined();
      expect(res).toEqual({
        resultParams: {
          dummy: 'dummy',
          dummyArray: mockRequest.nextUrl.searchParams.get('dummyArray'),
          dummyObject: mockRequest.nextUrl.searchParams.get('dummyObject'),
        },
      });
      expect(verifySignatureMock).toHaveBeenCalledWith({
        body: expect.any(String),
        integritySecret: expect.any(String), // Adjust based on actual value or logic
        signature: 'validSignature',
      });
    });
    it('should call verifySignature with correct arguments and handle failure of signature', async () => {
      // Mock verifySignature method
      verifySignatureMock.mockReturnValue(false);

      // Attempt to verify the request signature
      await expect(
        handler.extractAndVerifyShopifyRequest(mockRequest),
      ).rejects.toThrow('Invalid signature');

      // Check if verifySignature was called with the correct arguments
      expect(verifySignatureMock).toHaveBeenCalledWith({
        body: expect.any(String), // Since the exact sortedParams string might be hard to replicate here, use expect.any(String)
        integritySecret: expect.any(String),
        signature: 'validSignature',
      });
      // Ensure the mock was called exactly once
      expect(verifySignatureMock).toHaveBeenCalledTimes(1);
    });
    it('throws an error for an invalid API key', async () => {
      (getSecretApiKey as jest.Mock).mockResolvedValueOnce(null); // Simulate invalid API key

      await expect(
        handler.extractAndVerifyShopifyRequest(mockRequest),
      ).rejects.toThrow('Invalid signature');
    });

    it('throws an error when required parameters are missing', async () => {
      mockRequest.nextUrl.searchParams.delete('shop'); // Remove a required parameter

      await expect(
        handler.extractAndVerifyShopifyRequest(mockRequest),
      ).rejects.toThrow('Missing shop');
    });
  });
  it('should throw an error when the API key type is not Shopify', async () => {
    (getSecretApiKey as jest.Mock).mockResolvedValueOnce({
      type: ApiKeyType_Enum.External, // Invalid API key type
      encryptedIntegritySecret: 'encryptedSecret',
      allowlist: 'https://example.myshopify.com',
      organizerId: 'org123',
    });

    await expect(
      handler.extractAndVerifyShopifyRequest(mockRequest),
    ).rejects.toThrow('Invalid signature');
  });

  it('should throw an error when the API key does not have an encryptedIntegritySecret', async () => {
    (getSecretApiKey as jest.Mock).mockResolvedValueOnce({
      type: ApiKeyType_Enum.Shopify,
      encryptedIntegritySecret: undefined, // Missing encryptedIntegritySecret
      allowlist: 'https://example.myshopify.com',
      organizerId: 'org123',
    });

    await expect(
      handler.extractAndVerifyShopifyRequest(mockRequest),
    ).rejects.toThrow('Invalid signature');
  });

  it('should throw an error when the timestamp is outside the allowed time difference', async () => {
    mockRequest.nextUrl.searchParams.set(
      'timestamp',
      (Date.now() - 400 * 1000).toString(),
    ); // Timestamp outside allowed range

    await expect(
      handler.extractAndVerifyShopifyRequest(mockRequest),
    ).rejects.toThrow('Timestamp is older than 5 minutes');
  });

  // it.skip('should throw an error when the origin is not in the allowlist', async () => {
  //   (getSecretApiKey as jest.Mock).mockResolvedValueOnce({
  //     type: ApiKeyType_Enum.Shopify,
  //     encryptedIntegritySecret: 'encryptedSecret',
  //     allowlist: 'https://example.myshopify.com',
  //   });
  //   mockRequest.nextUrl.searchParams.set('shop', 'invalid.myshopify.com'); // Invalid origin

  //   await expect(
  //     handler.extractAndVerifyShopifyRequest(mockRequest),
  //   ).rejects.toThrow('Origin https://invalid.myshopify.com is not allowed.');
  // });

  // it.skip('should not throw an error when the allowlist is not defined', async () => {
  //   verifySignatureMock.mockReturnValue(true);
  //   (getSecretApiKey as jest.Mock).mockResolvedValueOnce({
  //     type: ApiKeyType_Enum.Shopify,
  //     encryptedIntegritySecret: 'encryptedSecret',
  //     allowlist: undefined, // Allowlist not defined
  //   });

  //   await expect(
  //     handler.extractAndVerifyShopifyRequest(mockRequest),
  //   ).resolves.not.toThrow();
  // });

  const createMockRequest = (params: URLSearchParams): NextRequest =>
    ({
      nextUrl: { searchParams: params },
      headers: new Headers({ 'x-shopify-client-id': 'validApiKey' }),
    }) as unknown as NextRequest;

  describe('mintLoyaltyCardWithPassword', () => {
    let mockLoyaltyCardSdk: LoyaltyCardNftWrapper;
    let shopifyHandler: ShopifyWebhookAndApiHandler;

    beforeEach(() => {
      shopifyHandler = new ShopifyWebhookAndApiHandler();
      mockLoyaltyCardSdk = new LoyaltyCardNftWrapper();
      // Mock internal methods to bypass their actual implementations
      shopifyHandler.extractAndVerifyShopifyRequest = jest
        .fn()
        .mockResolvedValue({
          resultParams: {
            password: 'test-password',
            ownerAddress: 'test-address',
          },
          organizerId: 'org123',
        });

      shopifyHandler.serializeAndValidateParams = jest.fn().mockResolvedValue({
        password: 'test-password',
        ownerAddress: 'test-address',
      });
    });
    it('successfully mints a loyalty card', async () => {
      const mockRequest = createMockRequest(
        new URLSearchParams({
          password: 'test-password',
          ownerAddress: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      const mintData = {
        password: 'test-password',
        ownerAddress: 'test-address',
        contractAddress: 'test-contract',
        chainId: getCurrentChain().chainIdHex,
      };

      mockLoyaltyCardSdk.mintWithPassword.mockResolvedValue({ success: true });

      const options: MintLoyaltyCardOptions = {
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      };

      const response =
        await shopifyHandler.mintLoyaltyCardWithPassword(options);

      expect(response.status).toBe(200);
      expect(mockLoyaltyCardSdk.mintWithPassword).toHaveBeenCalledWith(
        mintData,
      );
    });
    it('throws NotAuthorizedError for invalid API key', async () => {
      shopifyHandler.extractAndVerifyShopifyRequest = jest
        .fn()
        .mockRejectedValue(new Error('Not Authorized: Invalid API key'));
      const mockRequest = createMockRequest(
        new URLSearchParams({
          // Missing necessary parameters to simulate an unauthorized request
        }),
      );

      const options: MintLoyaltyCardOptions = {
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      };
      const response =
        await shopifyHandler.mintLoyaltyCardWithPassword(options);
      expect(response.status).toBe(403);
    });
    it('throws BadRequestError for invalid query parameters', async () => {
      shopifyHandler.serializeAndValidateParams = jest
        .fn()
        .mockRejectedValue(new Error('Invalid query parameters'));
      const mockRequest = createMockRequest(
        new URLSearchParams({
          // Incorrect or missing parameters to simulate bad request
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
        }),
      );

      const options: MintLoyaltyCardOptions = {
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      };

      const response =
        await shopifyHandler.mintLoyaltyCardWithPassword(options);
      expect(response.status).toBe(400);
    });
    it('throws InternalServerError for unexpected errors from LoyaltyCardNftWrapper', async () => {
      const mockRequest = createMockRequest(
        new URLSearchParams({
          password: 'test-password',
          ownerAddress: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      mockLoyaltyCardSdk.mintWithPassword.mockRejectedValue(
        new Error('Unexpected error'),
      );
      const options: MintLoyaltyCardOptions = {
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      };

      const response =
        await shopifyHandler.mintLoyaltyCardWithPassword(options);
      expect(response.status).toBe(500);
    });
    it('throws the customError from LoyaltyCardNftWrapper', async () => {
      const mockRequest = createMockRequest(
        new URLSearchParams({
          password: 'test-password',
          ownerAddress: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      mockLoyaltyCardSdk.mintWithPassword.mockRejectedValue(
        new NotFoundError('No loyalty card found for this contract address'),
      );
      const options: MintLoyaltyCardOptions = {
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      };

      const response =
        await shopifyHandler.mintLoyaltyCardWithPassword(options);
      expect(response.status).toBe(404);
    });
  });

  describe('ShopifyWebhookAndApiHandler - hasLoyaltyCard', () => {
    let handler: ShopifyWebhookAndApiHandler;
    let mockRequest: NextRequest;

    beforeEach(() => {
      handler = new ShopifyWebhookAndApiHandler();
      mockRequest = createMockRequest(
        new URLSearchParams({
          ownerAddress: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      jest.resetAllMocks();

      handler.extractAndVerifyShopifyRequest = jest.fn().mockResolvedValue({
        resultParams: {
          ownerAddress: 'test-address',
        },
      });

      (adminSdk.GetLoyaltyCardOwnedByAddress as jest.Mock).mockResolvedValue({
        loyaltyCardNft: [{}],
      });
    });

    it('should return true when the NFT exists', async () => {
      const response = await handler.hasLoyaltyCard(
        { req: mockRequest },
        'test-contract',
      );
      expect(response.status).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ isOwned: true });

      expect(adminSdk.GetLoyaltyCardOwnedByAddress).toHaveBeenCalledWith({
        contractAddress: 'test-contract',
        ownerAddress: 'test-address',
        chainId: getCurrentChain().chainIdHex,
      });
    });

    it('should return false when the NFT does not exist', async () => {
      (adminSdk.GetLoyaltyCardOwnedByAddress as jest.Mock).mockResolvedValue({
        loyaltyCardNft: [],
      });

      const response = await handler.hasLoyaltyCard(
        { req: mockRequest },
        'test-contract',
      );
      expect(response.status).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ isOwned: false });
    });

    it('throws NotAuthorizedError for invalid API key', async () => {
      handler.extractAndVerifyShopifyRequest = jest
        .fn()
        .mockRejectedValue(
          new NotAuthorizedError('Not Authorized: Invalid API key'),
        );

      await expect(
        handler.hasLoyaltyCard({ req: mockRequest }, 'test-contract'),
      ).rejects.toEqual(
        expect.objectContaining({
          name: 'NotAuthorizedError',
          message: expect.stringContaining('Not Authorized: Invalid API key'),
          statusCode: 403,
        }),
      );
    });

    it('throws BadRequestError for invalid query parameters', async () => {
      handler.serializeAndValidateParams = jest
        .fn()
        .mockRejectedValue(new BadRequestError('Invalid query parameters'));

      await expect(
        handler.hasLoyaltyCard({ req: mockRequest }, 'test-contract'),
      ).rejects.toEqual(
        new BadRequestError(
          'Invalid query parameters: Invalid query parameters',
        ),
      );
    });

    it('throws InternalServerError for unexpected errors from adminSdk', async () => {
      (adminSdk.GetLoyaltyCardOwnedByAddress as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(
        handler.hasLoyaltyCard({ req: mockRequest }, 'test-contract'),
      ).rejects.toEqual(
        new InternalServerError(
          'Error checking NFT existence: Unexpected error',
        ),
      );
    });
  });
});
