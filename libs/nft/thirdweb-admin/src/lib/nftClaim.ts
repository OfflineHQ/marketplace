import env from '@env/server';
import { GetMinterTemporaryWalletByLoyaltyCardIdQuery } from '@gql/admin/types';
import { getCurrentChain } from '@next/chains';
import {
  BaseSepoliaTestnet,
  Ethereum,
  Goerli,
  Mumbai,
  Polygon,
  PolygonAmoyTestnet,
  Sepolia,
} from '@thirdweb-dev/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export abstract class NFTClaim {
  sdk?: ThirdwebSDK;

  constructor() {}

  protected initializeSdk(
    minterTemporaryWallet: GetMinterTemporaryWalletByLoyaltyCardIdQuery['minterTemporaryWallet'][0],
  ) {
    try {
      this.sdk = ThirdwebSDK.fromPrivateKey(
        minterTemporaryWallet.privateKey,
        this.convertChainIdToThirdwebChain(
          getCurrentChain().chainId.toString(),
        ),
        {
          secretKey: env.THIRDWEB_SECRET_KEY,
          gasless: {
            openzeppelin: {
              relayerUrl: env.OPENZEPPELIN_URL,
            },
          },
        },
      );
    } catch (error) {
      console.error(`Error initializing ThirdwebSDK: ${error.message}`);
      throw error;
    }
  }

  protected initializeSdkFromMasterWallet() {
    try {
      this.sdk = ThirdwebSDK.fromPrivateKey(
        env.THIRDWEB_MASTER_PRIVATE_KEY,
        this.convertChainIdToThirdwebChain(
          getCurrentChain().chainId.toString(),
        ),
        {
          secretKey: env.THIRDWEB_SECRET_KEY,
        },
      );
    } catch (error) {
      console.error(`Error initializing ThirdwebSDK: ${error.message}`);
      throw error;
    }
  }

  convertChainIdToThirdwebChain(chainId: string) {
    switch (chainId) {
      case '1':
        return Ethereum;
      case '5':
        return Goerli;
      case '11155111':
        return Sepolia;
      case '80001':
        return Mumbai;
      case '137':
        return Polygon;
      case '84532':
        return BaseSepoliaTestnet;
      case '80002':
        return PolygonAmoyTestnet;
      default:
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  }

  // Abstract method to be implemented by subclasses
  abstract multicallClaim(...args: any[]): Promise<void>;
}
