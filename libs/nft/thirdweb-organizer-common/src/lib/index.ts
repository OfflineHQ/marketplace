import { generateRandomAlphanumericString } from '@crypto';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import { insertNftMintPasswords } from './action';

export interface CreateNftMintPasswordsProps
  extends Required<
    Pick<
      Parameters<typeof insertNftMintPasswords>[0][0],
      'contractAddress' | 'chainId'
    >
  > {
  amount: number;
}

export class ThirdwebOrganizerCommon {
  private sdk: ThirdwebSDK;

  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
  }

  async getAddressAndChainId(): Promise<[string, number]> {
    const [address, chainIdNumber] = await Promise.all([
      this.sdk.wallet.getAddress(),
      this.sdk.wallet.getChainId(), // Promise.resolve(getCurrentChain().chainId),
    ]);
    return [address, chainIdNumber];
  }

  async setErc721ContractWithClaimConditions(
    contractAddress: string,
    maxAmount: number,
  ) {
    const contract = await this.sdk.getContract(contractAddress);

    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    await contract.erc721.claimConditions.set([
      {
        metadata: {
          name: 'Phase de claim',
        },
        startTime: new Date(),
        maxClaimablePerWallet: 0,
        snapshot: [
          {
            address: walletAddress,
            maxClaimable: maxAmount,
          },
        ],
      },
    ]);

    return {
      contract,
      wallet: {
        address: walletAddress,
        privateKey,
      },
    };
  }

  async createNftMintPasswords({
    contractAddress,
    chainId,
    amount,
  }: CreateNftMintPasswordsProps) {
    const passwords = Array.from({ length: amount }, () =>
      generateRandomAlphanumericString(),
    );

    const data = await insertNftMintPasswords(
      passwords.map((password) => ({
        contractAddress,
        chainId,
        password,
      })),
    );
    return data?.returning;
  }
}
