import { adminSdk } from '@gql/admin/api';
import { GetLoyaltyCardByContractAddressForProcessQuery } from '@gql/admin/types';
import { LoyaltyCardNft } from '@nft/thirdweb-admin';

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
  loyaltyCardNft: LoyaltyCardNft,
) {
  const wallet = await getMinterTemporaryWallet(
    group.loyaltyCards[0].loyaltyCardId,
  );
  await loyaltyCardNft.multicallClaim(wallet, group.loyaltyCards);
}

export async function handler() {
  const loyaltyCards = (
    await adminSdk.GetLoyaltyCardByContractAddressForProcess()
  ).loyaltyCardNft;
  const groupedByContractAddress =
    await groupLoyaltyCardsByContractAddress(loyaltyCards);
  const loyaltyCardNft = new LoyaltyCardNft();

  const mintPromises = groupedByContractAddress.map((group) =>
    mintLoyaltyCardsForGroup(group, loyaltyCardNft).catch((error) => {
      console.error(
        `Error processing group for contractAddress: ${group.contractAddress}`,
        error,
      );
    }),
  );

  return Promise.all(mintPromises);
}
