import { AlchemyWrapper } from '@indexer/alchemy/admin';
import { NftFilter } from 'alchemy-sdk';
import {
  createWebhooksForEvent,
  updateWebhooksForEvent,
} from './createWebhooksForEvent';

jest.mock('@indexer/alchemy/admin');

describe('createWebhooksForEvent', () => {
  let mockAlchemyWrapper: jest.Mocked<AlchemyWrapper>;
  beforeEach(() => {
    mockAlchemyWrapper = {
      createNftActivityWebhook: jest.fn(),
      createNftMetadataUpdateWebhook: jest.fn(),
    } as unknown as jest.Mocked<AlchemyWrapper>;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create activity webhook when createActivityWebhook is true', async () => {
    const eventId = 'event1';
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await createWebhooksForEvent(
      {
        eventId,
        nftCollectionAddresses,
        createActivityWebhook: true,
      },
      mockAlchemyWrapper,
    );

    expect(mockAlchemyWrapper.createNftActivityWebhook).toHaveBeenCalledWith(
      `${process.env.WEB_APP_URL}api/webhooks/pass-nft-activity/${eventId}`,
      nftCollectionAddresses,
    );
  });

  it('should create metadata update webhook when createMetadataUpdateWebhook is true', async () => {
    const eventId = 'event1';
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await createWebhooksForEvent(
      {
        eventId,
        nftCollectionAddresses,
        createMetadataUpdateWebhook: true,
      },
      mockAlchemyWrapper,
    );

    expect(
      mockAlchemyWrapper.createNftMetadataUpdateWebhook,
    ).toHaveBeenCalledWith(
      `${process.env.WEB_APP_URL}api/webhooks/pass-nft-metadata-update/${eventId}`,
      nftCollectionAddresses,
    );
  });
});

describe('updateWebhooksForEvent', () => {
  let mockAlchemyWrapper: jest.Mocked<AlchemyWrapper>;
  beforeEach(() => {
    mockAlchemyWrapper = {
      addContractAddressToWebhook: jest.fn(),
    } as unknown as jest.Mocked<AlchemyWrapper>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update activity webhook when activityWebhookId is provided', async () => {
    const activityWebhookId = 'webhook1';
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await updateWebhooksForEvent(
      {
        activityWebhookId,
        nftCollectionAddresses,
      },
      mockAlchemyWrapper,
    );

    expect(mockAlchemyWrapper.addContractAddressToWebhook).toHaveBeenCalledWith(
      activityWebhookId,
      nftCollectionAddresses,
    );
  });

  it('should update metadata update webhook when metadataUpdateWebhookId is provided', async () => {
    const metadataUpdateWebhookId = 'webhook2';
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await updateWebhooksForEvent(
      {
        metadataUpdateWebhookId,
        nftCollectionAddresses,
      },
      mockAlchemyWrapper,
    );

    expect(mockAlchemyWrapper.addContractAddressToWebhook).toHaveBeenCalledWith(
      metadataUpdateWebhookId,
      nftCollectionAddresses,
    );
  });

  it('should not update activity webhook when activityWebhookId is not provided', async () => {
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await updateWebhooksForEvent(
      {
        nftCollectionAddresses,
      },
      mockAlchemyWrapper,
    );

    expect(
      mockAlchemyWrapper.addContractAddressToWebhook,
    ).not.toHaveBeenCalled();
  });

  it('should not update metadata update webhook when metadataUpdateWebhookId is not provided', async () => {
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await updateWebhooksForEvent(
      {
        nftCollectionAddresses,
      },
      mockAlchemyWrapper,
    );

    expect(
      mockAlchemyWrapper.addContractAddressToWebhook,
    ).not.toHaveBeenCalled();
  });
});
