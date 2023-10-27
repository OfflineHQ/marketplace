import { adminSdk } from '@gql/admin/api';
import { EventPassOrder, OrderStatus_Enum } from '@gql/shared/types';
import {
  applySeeds,
  createDbClient,
  deleteTables,
  type PgClient,
} from '@test-utils/db';
import { describe } from 'node:test';
import { NftClaimable } from './nft-thirdweb-api';

describe('NftClaimable integration test', () => {
  let nftClaimable: NftClaimable;
  let order: EventPassOrder;
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
  });

  beforeEach(async () => {
    nftClaimable = new NftClaimable();

    nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
      erc721: {
        claimConditions: { canClaim: jest.fn().mockResolvedValue(true) },
        claimTo: jest
          .fn()
          .mockResolvedValue([
            { id: { toNumber: jest.fn().mockReturnValue(1) } },
          ]),
      },
    });
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventPassPricing',
      'eventPassOrder',
    ]);
    const res = await adminSdk.GetEventPassOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId:
        'cs_test_a17kYy8IpmWsLecscKe5pRQNP5hir8ysWC9sturzdXMfh7Y94gYJIAyePN',
    });
    order = res.eventPassOrder[0] as EventPassOrder;
  });

  afterEach(async () => {
    await deleteTables(client, [
      'account',
      'eventPassNftContract',
      'eventPassPricing',
      'eventPassOrder',
    ]);
  });

  afterAll(async () => {
    await client.end();
  });

  it('should update the database when claimAllMetadatas is called', async () => {
    await nftClaimable.claimOrder(order);

    const updatedOrder = await adminSdk.GetAccountEventPassOrderForEventPasses({
      accountId: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
      eventPassIds: 'fake-event-pass-2',
    });
    expect(updatedOrder.eventPassOrder[0].status).toBe(
      OrderStatus_Enum.Completed,
    );
  });

  describe('with fails', () => {
    it('should throw an error when canClaim returns false', async () => {
      nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
        erc721: {
          claimConditions: {
            canClaim: jest.fn().mockResolvedValue(false),
            getClaimIneligibilityReasons: jest
              .fn()
              .mockResolvedValue('Not enough gas gas gas'),
          },
        },
      });

      await expect(nftClaimable.claimOrder(order)).rejects.toThrow();
    });

    it('should throw an error when claimTo fails', async () => {
      nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
        erc721: {
          claimConditions: { canClaim: jest.fn().mockResolvedValue(true) },
          claimTo: jest.fn().mockRejectedValue(new Error('claimTo failed')),
        },
      });

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());

      await expect(nftClaimable.claimOrder(order)).rejects.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'claimTo failed' }),
      );
      consoleSpy.mockRestore();
    });
  });
});
