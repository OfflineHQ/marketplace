'use server';
import { KycLevelName_Enum } from '@gql/shared/types';
import { Kyc } from '@kyc/admin';
import { AppUser } from '@next/types';
import { isApplicantPending } from './middlewares/isApplicantPending';
import env from '@env/server';

// This function is used to upgrade an applicant to a higher level, for instance when the user has reached a buying limit
export async function updateApplicantToLevel(user: AppUser) {
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.kyc?.applicantId) {
    throw new Error('User has no applicantId');
  }
  if (!user.kyc.reviewStatus || isApplicantPending(user.kyc.reviewStatus)) {
    throw new Error('User kyc is pending');
  }
  const kyc = new Kyc({
    secretKey: env.SUMSUB_SECRET_KEY,
    appToken: env.SUMSUB_API_KEY,
  });
  return await kyc.moveApplicantToLevel({
    applicantId: user.kyc.applicantId,
    levelName: KycLevelName_Enum.AdvancedKycLevel,
  });
}
