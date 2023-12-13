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
      'eventPassNft',
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
      'eventPassNft',
    ]);
  });

  afterAll(async () => {
    await client.end();
  });

  it('should update the database when claimOrder is called', async () => {
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
    let password: string;

    beforeEach(() => {
      nftClaimable = new NftClaimable();
      contractAddress = '0xfakecontractaddress1';
      password = 'password';

      nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
        erc721: {
          revealer: {
            reveal: jest.fn().mockResolvedValue(true),
          },
        },
      });
    });

    it('should call reveal on the contract with correct parameters', async () => {
      await nftClaimable.revealDelayedContract({ password, contractAddress });

      expect(nftClaimable.sdk.getContract).toHaveBeenCalledWith(
        contractAddress,
      );
      expect(
        (await nftClaimable.sdk.getContract('0x123')).erc721.revealer.reveal,
      ).toHaveBeenCalledWith(0, password);
    });

    it('should update the status of isDelayedReveal and return the list of currentOwnerAddress', async () => {
      const owners = await nftClaimable.revealDelayedContract({
        password,
        contractAddress,
      });

      const eventPassNftContract = (
        await adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId({
          eventPassId: 'clj8raobj7g8l0aw3bfw6dny4',
        })
      ).eventPassNftContract[0];

      expect(eventPassNftContract.isDelayedRevealed).toBe(true);
      expect(owners).toEqual([
        {
          currentOwnerAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
          tokenId: 12432,
        },
        {
          currentOwnerAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
          tokenId: 1234124,
        },
        {
          currentOwnerAddress: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
          tokenId: 11234514,
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
        nftClaimable.revealDelayedContract({ password, contractAddress }),
      ).rejects.toThrowError(
        `Error revealing the delayed contract at address ${contractAddress} : reveal failed`,
      );
    });

    it('should throw an error when update reveal status fails', async () => {
      adminSdk.UpdateEventPassNftContractDelayedRevealStatus = jest
        .fn()
        .mockRejectedValue(new Error('update failed'));

      await expect(
        nftClaimable.revealDelayedContract({ password, contractAddress }),
      ).rejects.toThrowError(
        new Error(
          `Error revealing the delayed contract at address ${contractAddress} : update failed`,
        ),
      );
    });
  });
});
