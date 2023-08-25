import { ExternalProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { createEventNftCollection } from '@features/organizer/event/server';

type nftsMetadata = {
  name: string;
  description: string;
  image: string;
};

class nftCollection {
  sdk: ThirdwebSDK;

  constructor(provider: ExternalProvider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    this.sdk = ThirdwebSDK.fromSigner(signer, 'goerli', {
      //TODO: networkId to env.
      clientId: '3ce7c20950e008cb1d6138a4a06d7e7f',
    });
  }

  async deployACollection(name: string, eventId: string) {
    const address = await this.sdk.wallet.getAddress();
    const chainId = await this.sdk.wallet.getChainId(); // TODO to hex

    const txResult = await this.sdk.deployer.deployBuiltInContract('nft-drop', {
      name,
      primary_sale_recipient: address,
      voting_token_address: address,
    });
  }

  async batchMint(contractAddress: string, metadatas: Array<nftsMetadata>) {
    const contract = await this.sdk.getContract(contractAddress);

    const tx = await contract.erc721.lazyMint(metadatas);
    const transactionReceipt = tx[0].receipt;

    console.log(transactionReceipt);
    tx.forEach((t) => {
      console.log(t.id);
    });
    // Loop to create eventPassNft with hasura
  }

  async getNftsFromContractAddress(contractAddress: string) {
    const contract = await this.sdk.getContract(contractAddress);

    return await contract.erc721.getAll();
  }
}

export default nftCollection;
