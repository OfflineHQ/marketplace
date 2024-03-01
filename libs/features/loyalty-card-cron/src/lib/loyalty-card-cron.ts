import { adminSdk } from '@gql/admin/api';
import { GetLoyaltyCardByContractAddressForProcessQuery } from '@gql/admin/types';
import { getCurrentChain } from '@next/chains';
import { LoyaltyCardCollection } from '@nft/thirdweb-organizer-loyalty-card';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export interface GroupedLoyaltyCards {
  contractAddress: string;
  loyaltyCards: GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'][number][];
}

export async function getMinterTemporaryWallet(key: string) {
  const response = await adminSdk.GetMinterTemporaryWalletByLoyaltyCardId({
    loyaltyCardId: key,
  });
  const wallet = response.minterTemporaryWallet[0];
  if (!wallet) {
    throw new Error(`No minterTemporaryWallet for loyaltyCardId: ${key}`);
  }
  return wallet;
}

export async function groupLoyaltyCardsByContractAddress(
  loyaltyCards: GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
): Promise<GroupedLoyaltyCards[]> {
  return loyaltyCards.reduce<GroupedLoyaltyCards[]>((acc, card) => {
    const group = acc.find((g) => g.contractAddress === card.contractAddress);
    if (group) {
      group.loyaltyCards.push(card);
    } else {
      acc.push({ contractAddress: card.contractAddress, loyaltyCards: [card] });
    }
    return acc;
  }, []);
}

export async function mintLoyaltyCardsForGroup(
  group: GroupedLoyaltyCards,
  loyaltyCardCollection: LoyaltyCardCollection,
) {
  const wallet = await getMinterTemporaryWallet(
    group.loyaltyCards[0].loyaltyCardId,
  );
  await loyaltyCardCollection.multicallMint(wallet, group.loyaltyCards);
}

export async function handler() {
  const loyaltyCards = (
    await adminSdk.GetLoyaltyCardByContractAddressForProcess()
  ).loyaltyCardNft;
  const groupedByContractAddress =
    await groupLoyaltyCardsByContractAddress(loyaltyCards);
  const loyaltyCardCollection = new LoyaltyCardCollection(
    new ThirdwebSDK(getCurrentChain().chainIdHex),
  );

  for (const group of groupedByContractAddress) {
    try {
      await mintLoyaltyCardsForGroup(group, loyaltyCardCollection);
    } catch (error) {
      console.error(
        `Error processing group for contractAddress: ${group.contractAddress}`,
        error,
      );
    }
  }
}
