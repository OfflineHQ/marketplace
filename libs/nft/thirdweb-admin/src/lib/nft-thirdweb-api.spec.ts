import { adminSdk } from '@gql/admin/api';
import { Order, OrderStatus_Enum } from '@gql/shared/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { describe } from 'node:test';
import { NftClaimable } from './nft-thirdweb-api';

describe('NftClaimable integration test', () => {
  let nftClaimable: NftClaimable;
  let order: Order;
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
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
      'passAmount',
      'passPricing',
      'stripeCheckoutSession',
      'stripeCustomer',
      'order',
      'nftTransfer',
      'eventPassNft',
    ]);
    const res = await adminSdk.GetOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId:
        'cs_test_a17kYy8IpmWsLecscKe5pRQNP5hir8ysWC9sturzdXMfh7Y94gYJIAyePN',
    });
    order = res.order[0] as Order;
  });

  afterEach(async () => {
    await deleteAllTables(client);
  });

  afterAll(async () => {
    await client.end();
  });

  it('should update the database when claimOrder is called', async () => {
    await nftClaimable.claimOrder(order);

    const updatedOrder = await adminSdk.GetAccountOrderForEventPasses({
      accountId: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
      eventPassIds: 'fake-event-pass-2',
    });
    expect(updatedOrder.order[0].status).toBe(OrderStatus_Enum.Completed);
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

      await expect(nftClaimable.checkOrder(order)).rejects.toThrow();
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
  describe('revealDelayedContract', () => {
    let nftClaimable: NftClaimable;
    let contractAddress: string;

    beforeEach(() => {
      nftClaimable = new NftClaimable();
      contractAddress = '0xFakeDelayedReveal';

      nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
        erc721: {
          revealer: {
            reveal: jest.fn().mockResolvedValue(true),
          },
        },
      });
    });

    it('should update the status of isDelayedReveal and return the list of currentOwnerAddress', async () => {
      const owners = await nftClaimable.revealDelayedContract(contractAddress);

      const eventPassNftContract = (
        await adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId({
          eventPassId: 'fakeEventPassDelayedRevealId',
        })
      ).eventPassNftContract[0];

      expect(eventPassNftContract.isDelayedRevealed).toBe(true);
      expect(owners.eventPassNft).toEqual([
        {
          currentOwnerAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
          tokenId: 0,
        },
        {
          currentOwnerAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
          tokenId: 1,
        },
        {
          currentOwnerAddress: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
          tokenId: 2,
        },
      ]);
    });

    it('should throw an error when reveal fails', async () => {
      nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
        erc721: {
          revealer: {
            reveal: jest.fn().mockRejectedValue(new Error('reveal failed')),
          },
        },
      });

      await expect(
        nftClaimable.revealDelayedContract(contractAddress),
      ).rejects.toThrowError(
        `Error revealing the delayed contract at address ${contractAddress} : reveal failed`,
      );
    });

    it('should throw an error when update reveal status fails', async () => {
      adminSdk.UpdateEventPassNftContractDelayedRevealStatus = jest
        .fn()
        .mockRejectedValue(new Error('update failed'));

      await expect(
        nftClaimable.revealDelayedContract(contractAddress),
      ).rejects.toThrowError(
        new Error(
          `Error revealing the delayed contract at address ${contractAddress} : update failed`,
        ),
      );
    });
  });
});
