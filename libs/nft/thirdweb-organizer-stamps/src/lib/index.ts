import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export class StampsCollection {
  private sdk: ThirdwebSDK;
  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
  }
}
