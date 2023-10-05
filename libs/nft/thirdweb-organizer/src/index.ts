'use client';

import env from '@env/client';
import { ExternalProvider } from '@ethersproject/providers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

export type NftsMetadata = {
  name: string;
  description: string;
  image: string;
};

class NftCollection {
  sdk: ThirdwebSDK;

  constructor(provider: ExternalProvider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    this.sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN, {
      clientId: '3ce7c20950e008cb1d6138a4a06d7e7f',
    });
  }

  async deployACollection(
    name: string,
    eventPassId: string,
    maxAmount: number,
    eventId: string,
    organizerId: string,
    eventSlug: string,
    metadata: NftsMetadata
  ) {
    if (maxAmount === 0) {
      return;
    }
    const address = await this.sdk.wallet.getAddress();
    const chainIdNumber = await this.sdk.wallet.getChainId();
    const chainId = chainIdNumber.toString();

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
          eventId: eventId,
          organizerId: organizerId,
        },
      }),
    });

    if (resCreate.status !== 200) {
      return;
    }

    const contract = await this.sdk.getContract(txResult);

    const metadatas = Array.from({ length: maxAmount }).map((_, i) => {
      return {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        external_url: `https://www.offline.live/pass/organizer/${organizerId}/event/${eventId}/eventPass/${eventPassId}/${i}`,
      };
    });
    const results = await contract.erc721.lazyMint(metadatas);
    console.log(txResult);
    const hasuraMetadatas = await Promise.all(
      metadatas.map(async (m, i) => {
        const data = await results[i].data();
        return {
          metadata: m,
          chainId: chainId,
          tokenId: data.id,
          tokenUri: data.uri,
          organizerId: organizerId,
          eventId: eventId,
          eventPassId: eventPassId,
          contractAddress: txResult,
        };
      })
    );
    console.log('hasuraMetadas : ', hasuraMetadatas);

    const resNfts = await fetch('/api/nft/nfts', {
      method: 'POST',
      body: JSON.stringify({
        props: {
          hasuraMetadatas,
        },
      }),
    });
    console.log(resNfts);
  }
}

export default NftCollection;
