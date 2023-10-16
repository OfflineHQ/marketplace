'use client';

import env from '@env/client';
import { ExternalProvider } from '@ethersproject/providers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import {
  createEventParametersAndWebhook,
  createEventPassNftContract,
  createEventPassNfts,
} from './action';

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
      gasless: {
        openzeppelin: {
          relayerUrl: env.NEXT_PUBLIC_OPENZEPPELIN_URL,
        },
      },
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
    try {
      const address = await this.sdk.wallet.getAddress();
      const chainIdNumber = await this.sdk.wallet.getChainId();
      const chainId = chainIdNumber.toString();

      const txResult = await this.sdk.deployer.deployBuiltInContract(
        'nft-drop',
        {
          name,
          primary_sale_recipient: address,
          voting_token_address: address,
        }
      );

      await createEventPassNftContract({
        contractAddress: txResult,
        eventPassId: eventPassId,
        chainId: chainId,
        eventId: eventId,
        organizerId: organizerId,
      });

      const contract = await this.sdk.getContract(txResult);

      await contract.erc721.claimConditions.set([
        {
          metadata: {
            name: 'Phase de claim',
          },
          startTime: new Date(),
          maxClaimablePerWallet: 0,
          snapshot: [
            {
              address: env.NEXT_PUBLIC_THIRDWEB_MASTER_ADDRESS,
              maxClaimable: maxAmount,
            },
          ],
        },
      ]);

      const metadatas = Array.from({ length: maxAmount }).map((_, i) => {
        return {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          external_url: `https://www.offline.live/pass/organizer/${organizerId}/event/${eventId}/eventPass/${eventPassId}/${i}`,
        };
      });
      const results = await contract.erc721.lazyMint(metadatas);

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

      await createEventPassNfts(hasuraMetadatas);
      await createEventParametersAndWebhook({
        eventId: eventPassId,
        nftCollectionAddresses: [{ contractAddress: txResult }],
        organizerId,
      });
    } catch (error) {
      console.error('Error deploying a collection:', error);
    }
  }
}

export default NftCollection;
