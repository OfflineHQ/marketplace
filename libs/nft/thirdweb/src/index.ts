import { ExternalProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
const contractTx = '0xd487927483a8F71cc6106914C66614EC3E010C1d';

class nftCollection {
  sdk: ThirdwebSDK;

  constructor(provider: ExternalProvider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    this.sdk = ThirdwebSDK.fromSigner(signer, 'goerli', {
      clientId: '3ce7c20950e008cb1d6138a4a06d7e7f',
    });
  }

  async deployACollection(name: string) {
    const address = await this.sdk.wallet.getAddress();
    const txResult = await this.sdk.deployer.deployBuiltInContract(
      'nft-collection',
      {
        name,
        primary_sale_recipient: address,
        voting_token_address: address,
      }
    );
  }

  async getContractFromTx(tx: string) {
    const contract = await this.sdk.getContract(tx);
    console.log(contract);
    const metadata = await contract.metadata.get();
    console.log(metadata);
  }
}

export default nftCollection;
