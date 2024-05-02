import { adminSdk } from '@gql/admin/api';
import {
  UpdateNftMintPasswordMinterMutationVariables,
  UpdateNftMintPasswordTokenIdMutationVariables,
} from '@gql/admin/types';
import { NftMintPassword } from '@nft/types';
import { MintPasswordNftWrapper } from './index';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    GetNftMintPasswordsForContractAvailable: jest.fn(),
    UpdateNftMintPasswordMinter: jest.fn(),
    UpdateNftMintPasswordTokenId: jest.fn(),
  },
}));

describe('MintPasswordNftWrapper', () => {
  let mintPasswordNftWrapper: MintPasswordNftWrapper;

  beforeEach(() => {
    mintPasswordNftWrapper = new MintPasswordNftWrapper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should evaluate a valid NFT mint password', async () => {
    const mockNftMintPasswords: NftMintPassword[] = [
      {
        id: '1',
        password: 'password1',
      },
      {
        id: '2',
        password: 'password2',
      },
    ];
    (
      adminSdk.GetNftMintPasswordsForContractAvailable as jest.Mock
    ).mockResolvedValue({ nftMintPassword: mockNftMintPasswords });

    const result = await mintPasswordNftWrapper.evaluateNftMintPassword({
      password: 'password1',
      contractAddress: '0x123',
      chainId: '1',
      organizerId: 'dummy',
    });

    expect(result).toEqual(mockNftMintPasswords[0]);
    expect(
      adminSdk.GetNftMintPasswordsForContractAvailable,
    ).toHaveBeenCalledWith({
      contractAddress: '0x123',
      chainId: '1',
      organizerId: 'dummy',
    });
  });

  it('should return undefined for an invalid NFT mint password', async () => {
    const mockNftMintPasswords: NftMintPassword[] = [
      {
        id: '1',
        password: 'password1',
      },
      {
        id: '2',
        password: 'password2',
      },
    ];
    (
      adminSdk.GetNftMintPasswordsForContractAvailable as jest.Mock
    ).mockResolvedValue({ nftMintPassword: mockNftMintPasswords });

    const result = await mintPasswordNftWrapper.evaluateNftMintPassword({
      password: 'invalidPassword',
      contractAddress: '0x123',
      chainId: '1',
      organizerId: 'dummy',
    });

    expect(result).toBeUndefined();
    expect(
      adminSdk.GetNftMintPasswordsForContractAvailable,
    ).toHaveBeenCalledWith({
      contractAddress: '0x123',
      chainId: '1',
      organizerId: 'dummy',
    });
  });

  it('should assign an NFT mint password to a minterAddress', async () => {
    const props: UpdateNftMintPasswordMinterMutationVariables = {
      id: '1',
      minterAddress: '0x456',
    };
    (adminSdk.UpdateNftMintPasswordMinter as jest.Mock).mockResolvedValue({
      updateNftMintPasswordMinter: { id: '1', minterAddress: '0x456' },
    });

    const result =
      await mintPasswordNftWrapper.assignNftMintPasswordToMinter(props);

    expect(result).toEqual({
      updateNftMintPasswordMinter: { id: '1', minterAddress: '0x456' },
    });
    expect(adminSdk.UpdateNftMintPasswordMinter).toHaveBeenCalledWith(props);
  });

  it('should assign a token ID to an NFT mint password', async () => {
    const props: UpdateNftMintPasswordTokenIdMutationVariables = {
      id: '1',
      tokenId: '100',
    };

    (adminSdk.UpdateNftMintPasswordTokenId as jest.Mock).mockResolvedValue({
      updateNftMintPasswordTokenId: { id: '1', tokenId: '100' },
    });

    const result =
      await mintPasswordNftWrapper.assignNftMintPasswordTokenId(props);

    expect(result).toEqual({
      updateNftMintPasswordTokenId: { id: '1', tokenId: '100' },
    });
    expect(adminSdk.UpdateNftMintPasswordTokenId).toHaveBeenCalledWith(props);
  });
});
