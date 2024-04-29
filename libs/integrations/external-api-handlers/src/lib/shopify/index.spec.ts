import { adminSdk } from '@gql/admin/api';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@next/api-handler';
import { getCurrentChain } from '@next/chains';
import { LoyaltyCardNftWrapper } from '@nft/loyalty-card';
import { NextRequest } from 'next/server';
import { MintLoyaltyCardOptions, ShopifyWebhookAndApiHandler } from './index';
import { handleAccount } from '@features/account/api';

jest.mock('@features/account/api');
jest.mock('@integrations/api-keys');
jest.mock('@crypto');
jest.mock('@nft/loyalty-card', () => ({
  LoyaltyCardNftWrapper: jest.fn().mockImplementation(() => ({
    mintWithPassword: jest.fn(),
    mint: jest.fn(),
    setAsMinted: jest.fn(),
    getLoyaltyCardOwnedByAddress: jest.fn(),
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
  });

  describe('extractAndVerifyShopifyRequest', () => {
    beforeEach(() => {
      (adminSdk.GetShopifyDomain as jest.Mock).mockResolvedValue({
        shopifyDomain_by_pk: [
          {
            organizerId: 'test-organizer-id',
          },
        ],
      });
    });
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

    it('throws an error when required parameters are missing', async () => {
      mockRequest.nextUrl.searchParams.delete('shop'); // Remove a required parameter

      await expect(
        handler.extractAndVerifyShopifyRequest(mockRequest),
      ).rejects.toThrow('Missing shop');
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

    it('throws an error when the shop is not found', async () => {
      verifySignatureMock.mockReturnValue(true);
      (adminSdk.GetShopifyDomain as jest.Mock).mockResolvedValueOnce({
        shopifyDomain_by_pk: null, // Simulate shop not found
      });

      await expect(
        handler.extractAndVerifyShopifyRequest(mockRequest),
      ).rejects.toThrow(`Shopify domain example.myshopify.com not found`);
    });
  });

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

      (mockLoyaltyCardSdk.mintWithPassword as jest.Mock).mockResolvedValue({
        success: true,
      });

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
      expect(response.status).toBe(401);
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

      (mockLoyaltyCardSdk.mintWithPassword as jest.Mock).mockRejectedValue(
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

      (mockLoyaltyCardSdk.mintWithPassword as jest.Mock).mockRejectedValue(
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
    let mockLoyaltyCardSdk: LoyaltyCardNftWrapper;

    beforeEach(() => {
      handler = new ShopifyWebhookAndApiHandler();
      mockLoyaltyCardSdk = new LoyaltyCardNftWrapper();
      mockRequest = createMockRequest(
        new URLSearchParams({
          ownerAddress: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

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
      (
        mockLoyaltyCardSdk.getLoyaltyCardOwnedByAddress as jest.Mock
      ).mockResolvedValue({});
      const response = await handler.hasLoyaltyCard({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });

      expect(response.status).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ isOwned: true });

      expect(
        mockLoyaltyCardSdk.getLoyaltyCardOwnedByAddress,
      ).toHaveBeenCalledWith({
        contractAddress: 'test-contract',
        ownerAddress: 'test-address',
        chainId: getCurrentChain().chainIdHex,
      });
    });

    it('should return false when the NFT does not exist', async () => {
      (
        mockLoyaltyCardSdk.getLoyaltyCardOwnedByAddress as jest.Mock
      ).mockResolvedValue(null);

      const response = await handler.hasLoyaltyCard({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ isOwned: false });
    });

    it('throws NotAuthorizedError for invalid API key', async () => {
      handler.extractAndVerifyShopifyRequest = jest
        .fn()
        .mockRejectedValue(
          new NotAuthorizedError('Not Authorized: Invalid API key'),
        );

      const response = await handler.hasLoyaltyCard({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(401);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining('Not Authorized: Invalid API key'),
        }),
      );
    });

    it('throws BadRequestError for invalid query parameters', async () => {
      handler.serializeAndValidateParams = jest
        .fn()
        .mockRejectedValue(new BadRequestError('Invalid query parameters'));

      const response = await handler.hasLoyaltyCard({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(400);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining('Invalid query parameters'),
        }),
      );
    });

    it('throws InternalServerError for unexpected errors from adminSdk', async () => {
      (adminSdk.GetLoyaltyCardOwnedByAddress as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );
      const response = await handler.hasLoyaltyCard({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(500);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining('Internal Server Error'),
        }),
      );
    });
  });
  describe('ShopifyWebhookAndApiHandler - mintLoyaltyCardWithCustomerId', () => {
    let handler: ShopifyWebhookAndApiHandler;
    let mockRequest: NextRequest;
    let mockLoyaltyCardSdk: LoyaltyCardNftWrapper;

    beforeEach(() => {
      handler = new ShopifyWebhookAndApiHandler();
      mockLoyaltyCardSdk = new LoyaltyCardNftWrapper();

      mockRequest = createMockRequest(
        new URLSearchParams({
          ownerAddress: 'test-address',
          customerId: 'test-customer-id',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      handler.extractAndVerifyShopifyRequest = jest.fn().mockResolvedValue({
        resultParams: {
          ownerAddress: 'test-address',
          customerId: 'test-customer-id',
        },
        organizerId: 'test-organizer-id',
      });

      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [
          {
            address: 'test-address',
          },
        ],
      });
    });

    it('should successfully mint a loyalty card with a valid customer ID', async () => {
      (mockLoyaltyCardSdk.mint as jest.Mock).mockResolvedValue({
        success: true,
      });
      const response = await handler.mintLoyaltyCardWithCustomerId({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(200);
      expect(mockLoyaltyCardSdk.mint).toHaveBeenCalledWith({
        contractAddress: 'test-contract',
        ownerAddress: 'test-address',
        chainId: getCurrentChain().chainIdHex,
        organizerId: 'test-organizer-id',
      });
      expect(adminSdk.InsertShopifyCustomer).not.toHaveBeenCalled();
    });

    it('should create a new Shopify customer if one does not exist', async () => {
      (mockLoyaltyCardSdk.mint as jest.Mock).mockResolvedValue({
        success: true,
      });
      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [],
      });

      await handler.mintLoyaltyCardWithCustomerId({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });

      expect(adminSdk.InsertShopifyCustomer).toHaveBeenCalledWith({
        object: {
          organizerId: 'test-organizer-id',
          customerId: 'test-customer-id',
          address: 'test-address',
        },
      });
    });

    it('should throw ForbiddenError if the owner address does not match the customer address', async () => {
      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [
          {
            address: 'different-address',
          },
        ],
      });

      const response = await handler.mintLoyaltyCardWithCustomerId({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });

      expect(response.status).toBe(403);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining('Invalid owner address'),
        }),
      );
    });

    it('should throw the custom error from LoyaltyCardNftWrapper', async () => {
      (mockLoyaltyCardSdk.mint as jest.Mock).mockRejectedValue(
        new BadRequestError('Test error'),
      );

      const response = await handler.mintLoyaltyCardWithCustomerId({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(400);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining('Test error'),
        }),
      );
    });

    it('should wrap non-custom errors in InternalServerError', async () => {
      (mockLoyaltyCardSdk.mint as jest.Mock).mockRejectedValue(
        new Error('Unknown error'),
      );

      const response = await handler.mintLoyaltyCardWithCustomerId({
        req: mockRequest,
        contractAddress: 'test-contract',
        loyaltyCardSdk: mockLoyaltyCardSdk,
      });
      expect(response.status).toBe(500);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        }),
      );
    });
  });
  describe('ShopifyWebhookAndApiHandler - createShopifyCustomer', () => {
    let handler: ShopifyWebhookAndApiHandler;
    let mockRequest: NextRequest;

    beforeEach(() => {
      handler = new ShopifyWebhookAndApiHandler();
      mockRequest = createMockRequest(
        new URLSearchParams({
          address: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      handler.extractAndVerifyShopifyRequest = jest.fn().mockResolvedValue({
        resultParams: {
          address: 'test-address',
        },
        organizerId: 'test-organizer-id',
      });

      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [],
      });
    });

    it('should create a new Shopify customer', async () => {
      const response = await handler.createShopifyCustomer({
        req: mockRequest,
        id: 'test-customer-id',
      });
      expect(handleAccount as jest.Mock).toHaveBeenCalledWith({
        address: 'test-address',
      });
      expect(response.status).toBe(200);
      expect(adminSdk.InsertShopifyCustomer).toHaveBeenCalledWith({
        object: {
          organizerId: 'test-organizer-id',
          id: 'test-customer-id',
          address: 'test-address',
        },
      });
    });

    it('should throw BadRequestError if the customer already exists', async () => {
      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [{ address: 'test-address' }],
      });

      const response = await handler.createShopifyCustomer({
        req: mockRequest,
        id: 'test-customer-id',
      });

      expect(response.status).toBe(400);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining('Customer already exists'),
        }),
      );
    });
  });

  describe('ShopifyWebhookAndApiHandler - hasShopifyCustomer', () => {
    let handler: ShopifyWebhookAndApiHandler;
    let mockRequest: NextRequest;

    beforeEach(() => {
      handler = new ShopifyWebhookAndApiHandler();
      mockRequest = createMockRequest(
        new URLSearchParams({
          address: 'test-address',
          shop: 'example.myshopify.com',
          timestamp: Date.now().toString(),
          signature: 'validSignature',
        }),
      );

      handler.extractAndVerifyShopifyRequest = jest.fn().mockResolvedValue({
        resultParams: {
          address: 'test-address',
        },
        organizerId: 'test-organizer-id',
      });

      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [{ address: 'test-address' }],
      });
    });

    it('should return the Shopify customer', async () => {
      const response = await handler.hasShopifyCustomer({
        req: mockRequest,
        id: 'test-customer-id',
      });

      expect(response.status).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ address: 'test-address' });
    });

    it('should throw ForbiddenError if the address does not match', async () => {
      (adminSdk.GetShopifyCustomer as jest.Mock).mockResolvedValue({
        shopifyCustomer: [{ address: 'different-address' }],
      });
      const response = await handler.hasShopifyCustomer({
        req: mockRequest,
        id: 'test-customer-id',
      });

      expect(response.status).toBe(403);
      expect(JSON.parse(response.body)).toEqual(
        expect.objectContaining({
          error: expect.stringContaining(
            'Invalid address. The address must match the address of the customer.',
          ),
        }),
      );
    });
  });
});
