'use server';
import { getAccount } from '@features/account/api';
import { adminSdk } from '@gql/admin/api';
import { KycStatus_Enum } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';

export async function handleApplicantStatusChanged(
  status: KycStatus_Enum
): Promise<boolean> {
  const user = await getCurrentUser();
  let statusDifferent = false;
  if (!user) {
    throw new Error('User not found');
  }
  const account = await getAccount(user.address);
  if (!account.kyc?.applicantId) {
    throw new Error("User doesn't have an applicant created");
  }
  if (account.kyc.reviewStatus !== status) {
    await adminSdk.UpdateKyc({
      externalUserId: user.id,
      kyc: {
        reviewStatus: status,
      },
    });
    statusDifferent = true;
  }
  return statusDifferent;
}
