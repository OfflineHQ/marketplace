'use client';

import { ExternalProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export type nftsMetadata = {
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
      clientId: '3ce7c20950e008cb1d6138a4a06d7e7f',
    });
  }

  async deployACollection(
    name: string,
    eventPassId: string,
    maxAmount: number,
    metadata: nftsMetadata
  ) {
    if (maxAmount === 0) {
      return;
    }
    const address = await this.sdk.wallet.getAddress();
    const chainId = await this.sdk.wallet.getChainId();

    const txResult = await this.sdk.deployer.deployBuiltInContract('nft-drop', {
      name,
      primary_sale_recipient: address,
      voting_token_address: address,
    });

    const resCreate = await fetch('/api/nft/create', {
      method: 'POST',
      body: JSON.stringify({
        props: {
          contractAddress: txResult,
          id: eventPassId,
          chainId: chainId,
        },
      }),
    });

    if (resCreate.status !== 200) {
      return;
    }

    const contract = await this.sdk.getContract(txResult);

    const metadatas = Array(maxAmount).fill(metadata);
    await contract.erc721.lazyMint(metadatas);
    console.log(txResult);
  }
}

export default nftCollection;
