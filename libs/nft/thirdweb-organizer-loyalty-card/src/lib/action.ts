'use server';

import {
  createWebhooksForLoyaltyCard,
  getAlchemyInfosFromLoyaltyCardId,
  updateWebhooksForLoyaltyCard,
} from '@features/back-office/loyalty-card-api';
import { adminSdk } from '@gql/admin/api';
import {
  LoyaltyCardNftContract_Insert_Input,
  LoyaltyCardParameters_Insert_Input,
} from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { getCurrentUser } from '@next/next-auth/user';
import { NFTMetadata, ThirdwebSDK } from '@thirdweb-dev/sdk';

async function prepareLoyaltyCardAction(
  eventPassId: string,
  sdk: ThirdwebSDK,
): Promise<{ userAddress: string; contract: any }> {
  const user = await getCurrentUser();

  if (!user?.kyc) throw new Error(`User ${user?.id} has no kyc`);
  if (!isUserKycValidated(user))
    throw new Error(`User ${user.id} kyc is not validated`);

  const eventPassNftContractData = (
    await adminSdk.GetContractAddressFromEventPassId({ eventPassId })
  ).eventPassNftContract[0];

  if (!eventPassNftContractData || !eventPassNftContractData.contractAddress) {
    throw new Error(
      `No contract address found for event pass ID: ${eventPassId}`,
    );
  }

  const contract = await sdk.getContract(
    eventPassNftContractData.contractAddress,
  );

  return { userAddress: user.address, contract };
}

export async function loyaltyCardMintTo(
  eventPassId: string,
  metadata: NFTMetadata,
  sdk: ThirdwebSDK,
) {
  const { userAddress, contract } = await prepareLoyaltyCardAction(
    eventPassId,
    sdk,
  );
  return contract.erc721.mintTo(userAddress, metadata);
}

export async function loyaltyCardSignatureMint(
  eventPassId: string,
  metadata: NFTMetadata,
  sdk: ThirdwebSDK,
) {
  const { userAddress, contract } = await prepareLoyaltyCardAction(
    eventPassId,
    sdk,
  );
  const startTime = new Date();
  const endTime = new Date(Date.now() + 10 * 60 * 1000);
  const payload = {
    metadata: metadata,
    to: userAddress,
    quantity: 1,
    mintStartTime: startTime,
    mintEndTime: endTime,
  };
  return contract.erc721.signature.generate(payload);
}

export async function createLoyaltyCardContract(
  object: Omit<LoyaltyCardNftContract_Insert_Input, 'organizerId'>,
) {
  const user = await getCurrentUser();
  if (!user || !user.role?.organizerId)
    throw new Error('No user role found for organizer');
  else {
    const data = await adminSdk.InsertLoyaltyCardNftContract({
      object: { ...object, organizerId: user.role?.organizerId },
    });
    return data?.insert_loyaltyCardNftContract_one;
  }
}

export async function createLoyaltyCardParametersAndWebhook({
  contractAddress,
  ...object
}: Omit<LoyaltyCardParameters_Insert_Input, 'organizerId'> & {
  contractAddress: string;
}) {
  const user = await getCurrentUser();
  if (!user || !user.role?.organizerId)
    throw new Error('No user role found for organizer');
  else if (!object.loyaltyCardId) throw new Error('No loyalty card id found');
  else {
    const loyaltyCardParameters = await getAlchemyInfosFromLoyaltyCardId({
      loyaltyCardId: object.loyaltyCardId,
    });
    if (loyaltyCardParameters) {
      return updateWebhooksForLoyaltyCard({
        activityWebhookId: loyaltyCardParameters.activityWebhookId || undefined,
        metadataUpdateWebhookId:
          loyaltyCardParameters.metadataUpdateWebhookId || undefined,
        nftCollectionAddresses: [{ contractAddress }],
      });
    } else {
      const { activityWebhook, metadataUpdateWebhook } =
        await createWebhooksForLoyaltyCard({
          loyaltyCardId: object.loyaltyCardId,
          nftCollectionAddresses: [{ contractAddress }],
          createActivityWebhook: true,
          createMetadataUpdateWebhook: true,
        });
      return adminSdk.CreateLoyaltyCardParameters({
        object: {
          ...object,
          organizerId: user.role?.organizerId,
          activityWebhookId: activityWebhook?.id,
          activityWebhookSigningKey: activityWebhook?.signingKey,
          metadataUpdateWebhookId: metadataUpdateWebhook?.id,
          metadataUpdateWebhookSigningKey: metadataUpdateWebhook?.signingKey,
        },
      });
    }
  }
}
