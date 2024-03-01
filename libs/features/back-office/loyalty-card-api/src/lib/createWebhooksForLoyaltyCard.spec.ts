import { AlchemyWrapper } from '@indexer/alchemy/admin';
import { NftFilter } from 'alchemy-sdk';
import {
  createWebhooksForLoyaltyCard,
  updateWebhooksForLoyaltyCard,
} from './createWebhooksForLoyaltyCard';

jest.mock('@indexer/alchemy/admin');

describe('createWebhooksForLoyaltyCard', () => {
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
    const loyaltyCardId = 'card1';
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await createWebhooksForLoyaltyCard(
      {
        loyaltyCardId,
        nftCollectionAddresses,
        createActivityWebhook: true,
      },
      mockAlchemyWrapper,
    );

    expect(mockAlchemyWrapper.createNftActivityWebhook).toHaveBeenCalledWith(
      `${process.env.WEB_APP_URL}api/webhooks/loyalty-card-nft-activity/${loyaltyCardId}`,
      nftCollectionAddresses,
    );
  });

  it('should create metadata update webhook when createMetadataUpdateWebhook is true', async () => {
    const loyaltyCardId = 'card1';
    const nftCollectionAddresses: NftFilter[] = [{ contractAddress: '0x123' }];

    await createWebhooksForLoyaltyCard(
      {
        loyaltyCardId,
        nftCollectionAddresses,
        createMetadataUpdateWebhook: true,
      },
      mockAlchemyWrapper,
    );

    expect(
      mockAlchemyWrapper.createNftMetadataUpdateWebhook,
    ).toHaveBeenCalledWith(
      `${process.env.WEB_APP_URL}api/webhooks/loyalty-card-nft-metadata-update/${loyaltyCardId}`,
      nftCollectionAddresses,
    );
  });
});

describe('updateWebhooksForLoyaltyCard', () => {
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

    await updateWebhooksForLoyaltyCard(
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
    await updateWebhooksForLoyaltyCard(
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
    await updateWebhooksForLoyaltyCard(
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
    await updateWebhooksForLoyaltyCard({
      nftCollectionAddresses,
    });
    expect(
      mockAlchemyWrapper.addContractAddressToWebhook,
    ).not.toHaveBeenCalled();
  });
});
