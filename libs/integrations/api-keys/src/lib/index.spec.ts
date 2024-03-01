import { adminSdk } from '@gql/admin/api';
import {
  createPublishableApiKey,
  createSecretApiKey,
  getPublishableApiKey,
  getSecretApiKey,
  inputSecretKey,
} from './index';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    CreateSecretApiKey: jest.fn(),
    GetSecretApiKey: jest.fn(),
    CreatePublishableApiKey: jest.fn(),
    GetPublishableApiKey: jest.fn(),
  },
}));

describe('Shopify API Key functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('inputSecretKey', () => {
    const props = {
      apiKey: 'test_api_key',
      organizerId: 'org123',
      allowlist: 'example.com',
      expiresAt: new Date(),
      name: 'Test Key',
    };
    const mockResponse = {
      insert_secretApiKey_one: {
        id: 'key123',
        apiKey: props.apiKey,
        // other fields...
      },
    };

    it('should create a secret API key with origin secret', async () => {
      const originSecret = 'test_origin_secret';
      (adminSdk.CreateSecretApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await inputSecretKey({
        ...props,
        originSecret,
      });

      expect(adminSdk.CreateSecretApiKey).toHaveBeenCalledWith({
        object: expect.objectContaining({
          ...props,
          hashedOriginSecret: expect.any(String),
          originSecretSalt: expect.any(String),
        }),
      });
      expect(result).toEqual(mockResponse.insert_secretApiKey_one);
    });

    it('should create a secret API key with integrity secret', async () => {
      const integritySecret = 'test_integrity_secret';
      (adminSdk.CreateSecretApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await inputSecretKey({
        ...props,
        integritySecret,
      });

      expect(adminSdk.CreateSecretApiKey).toHaveBeenCalledWith({
        object: expect.objectContaining({
          ...props,
          encryptedIntegritySecret: expect.any(String),
        }),
      });
      expect(result).toEqual(mockResponse.insert_secretApiKey_one);
    });

    it('should create a secret API key with both origin and integrity secrets', async () => {
      const originSecret = 'test_origin_secret';
      const integritySecret = 'test_integrity_secret';
      (adminSdk.CreateSecretApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await inputSecretKey({
        ...props,
        originSecret,
        integritySecret,
      });

      expect(adminSdk.CreateSecretApiKey).toHaveBeenCalledWith({
        object: expect.objectContaining({
          ...props,
          hashedOriginSecret: expect.any(String),
          originSecretSalt: expect.any(String),
          encryptedIntegritySecret: expect.any(String),
        }),
      });
      expect(result).toEqual(mockResponse.insert_secretApiKey_one);
    });

    it('should throw an error if neither originSecret nor integritySecret is provided', async () => {
      await expect(inputSecretKey(props)).rejects.toThrow(
        'At least one of originSecret or integritySecret must be provided',
      );
    });

    it('should throw an error if key creation fails', async () => {
      const originSecret = 'test_origin_secret';
      (adminSdk.CreateSecretApiKey as jest.Mock).mockResolvedValueOnce({});

      await expect(
        inputSecretKey({
          ...props,
          originSecret,
        }),
      ).rejects.toThrow('Failed to create secret API key');
    });
  });

  describe('createSecretApiKey', () => {
    const props = {
      allowlist: 'example.com',
      expiresAt: new Date(),
      name: 'Test Key',
      organizerId: 'org123',
    };
    const mockResponse = {
      insert_secretApiKey_one: {
        id: 'key123',
        apiKey: 'test_secret_key',
        // other fields...
      },
    };

    it('should create a secret API key with origin and integrity secrets', async () => {
      (adminSdk.CreateSecretApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await createSecretApiKey(props);

      expect(adminSdk.CreateSecretApiKey).toHaveBeenCalledWith({
        object: expect.objectContaining({
          ...props,
          apiKey: expect.any(String),
          hashedOriginSecret: expect.any(String),
          originSecretSalt: expect.any(String),
          encryptedIntegritySecret: expect.any(String),
        }),
      });
      expect(result).toEqual({
        ...mockResponse.insert_secretApiKey_one,
        apiKeyIntegritySecret: expect.any(String),
        apiKeySecret: expect.any(String),
      });
    });

    it('should throw an error if both originSecret and integritySecret are false', async () => {
      await expect(
        createSecretApiKey({
          ...props,
          originSecret: false,
          integritySecret: false,
        }),
      ).rejects.toThrow(
        'At least one of originSecret or integritySecret must be true',
      );
    });

    it('should throw an error if key creation fails', async () => {
      (adminSdk.CreateSecretApiKey as jest.Mock).mockResolvedValueOnce({});

      await expect(createSecretApiKey(props)).rejects.toThrow(
        'Failed to create Shopify API key',
      );
    });
  });

  describe('getSecretApiKey', () => {
    const apiKey = 'test_secret_key';
    const mockResponse = {
      secretApiKey: [
        {
          id: 'key123',
          apiKey,
          // other fields...
        },
      ],
    };

    it('should get a secret API key', async () => {
      (adminSdk.GetSecretApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await getSecretApiKey(apiKey);

      expect(adminSdk.GetSecretApiKey).toHaveBeenCalledWith({ apiKey });
      expect(result).toEqual(mockResponse.secretApiKey[0]);
    });
  });

  describe('createPublishableApiKey', () => {
    const props = {
      allowlist: 'example.com',
      expiresAt: new Date(),
      name: 'Test Key',
      organizerId: 'org123',
    };
    const mockResponse = {
      insert_publishableApiKey_one: {
        id: 'key123',
        apiKey: 'test_publishable_key',
        // other fields...
      },
    };

    it('should create a publishable API key', async () => {
      (adminSdk.CreatePublishableApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await createPublishableApiKey(props);

      expect(adminSdk.CreatePublishableApiKey).toHaveBeenCalledWith({
        object: expect.objectContaining({
          ...props,
          apiKey: expect.any(String),
        }),
      });
      expect(result).toEqual(mockResponse.insert_publishableApiKey_one);
    });

    it('should throw an error if key creation fails', async () => {
      (adminSdk.CreatePublishableApiKey as jest.Mock).mockResolvedValueOnce({});

      await expect(createPublishableApiKey(props)).rejects.toThrow(
        'Failed to create Shopify API key',
      );
    });
  });

  describe('getPublishableApiKey', () => {
    const apiKey = 'test_publishable_key';
    const mockResponse = {
      publishableApiKey: [
        {
          id: 'key123',
          apiKey,
          // other fields...
        },
      ],
    };

    it('should get a publishable API key', async () => {
      (adminSdk.GetPublishableApiKey as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await getPublishableApiKey(apiKey);

      expect(adminSdk.GetPublishableApiKey).toHaveBeenCalledWith({ apiKey });
      expect(result).toEqual(mockResponse.publishableApiKey[0]);
    });
  });
});
