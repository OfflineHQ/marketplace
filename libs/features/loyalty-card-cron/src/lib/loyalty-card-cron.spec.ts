import { adminSdk } from '@gql/admin/api';
import { GetLoyaltyCardByContractAddressForProcessQuery } from '@gql/admin/types';
import {
  getMinterTemporaryWallet,
  groupLoyaltyCardsByContractAddress,
} from './loyalty-card-cron';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    GetLoyaltyCardByContractAddressForProcess: jest.fn().mockResolvedValue({
      loyaltyCardNft: [
        { id: '1', contractAddress: 'address1', loyaltyCardId: 'card1' },
        { id: '2', contractAddress: 'address2', loyaltyCardId: 'card2' },
      ],
    }),
    GetMinterTemporaryWalletByLoyaltyCardId: jest.fn().mockResolvedValue({
      minterTemporaryWallet: [
        { id: 'wallet1', address: '0x123', privateKey: 'veryPrivateKey' },
      ],
    }),
  },
}));

describe('getMinterTemporaryWallet', () => {
  it('should return the wallet when found', async () => {
    const mockWallet = { id: 'wallet1', address: '0x123' };
    (
      adminSdk.GetMinterTemporaryWalletByLoyaltyCardId as jest.Mock
    ).mockResolvedValue({
      minterTemporaryWallet: [mockWallet],
    });

    const result = await getMinterTemporaryWallet('1');
    expect(result).toEqual(mockWallet);
    expect(
      adminSdk.GetMinterTemporaryWalletByLoyaltyCardId,
    ).toHaveBeenCalledWith({
      loyaltyCardId: '1',
    });
  });

  it('should throw an error when the wallet is not found', async () => {
    (
      adminSdk.GetMinterTemporaryWalletByLoyaltyCardId as jest.Mock
    ).mockResolvedValue({
      minterTemporaryWallet: [],
    });

    await expect(getMinterTemporaryWallet('2')).rejects.toThrow(
      'No minterTemporaryWallet for loyaltyCardId: 2',
    );
    expect(
      adminSdk.GetMinterTemporaryWalletByLoyaltyCardId,
    ).toHaveBeenCalledWith({
      loyaltyCardId: '2',
    });
  });
});

describe('groupLoyaltyCardsByContractAddress', () => {
  it('should group multiple loyalty cards under the same contract address', async () => {
    const loyaltyCards = [
      { id: '1', contractAddress: 'address1' },
      { id: '2', contractAddress: 'address1' },
    ] as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'];
    const expected = [
      {
        contractAddress: 'address1',
        loyaltyCards: [
          { id: '1', contractAddress: 'address1' },
          { id: '2', contractAddress: 'address1' },
        ] as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
      },
    ];
    const result = await groupLoyaltyCardsByContractAddress(loyaltyCards);
    expect(result).toEqual(expected);
  });

  it('should handle loyalty cards with different contract addresses', async () => {
    const loyaltyCards = [
      { id: '1', contractAddress: 'address1' },
      { id: '2', contractAddress: 'address2' },
    ] as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'];
    const expected = [
      {
        contractAddress: 'address1',
        loyaltyCards: [
          { id: '1', contractAddress: 'address1' },
        ] as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
      },
      {
        contractAddress: 'address2',
        loyaltyCards: [
          { id: '2', contractAddress: 'address2' },
        ] as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
      },
    ];
    const result = await groupLoyaltyCardsByContractAddress(loyaltyCards);
    expect(result).toEqual(expected);
  });

  it('should return an empty array when given an empty array of loyalty cards', async () => {
    const loyaltyCards =
      [] as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'];
    const expected = [];
    const result = await groupLoyaltyCardsByContractAddress(loyaltyCards);
    expect(result).toEqual(expected);
  });
});
