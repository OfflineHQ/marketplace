'use server';

import env from '@env/server';
import { KycLevelName_Enum, Locale } from '@gql/shared/types';
import { Kyc } from '@kyc/admin';
import { getCurrentUser } from '@next/next-auth/user';

// This function is used to create an applicant for a user before he starts the KYC process
export async function createSumSubApplicant(lang?: Locale) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }
  if (user.kyc?.applicantId) {
    throw new Error('User already have an applicantId');
  }
  const kyc = new Kyc({
    secretKey: env.SUMSUB_SECRET_KEY as string,
    appToken: env.SUMSUB_API_KEY as string,
  });
  return await kyc.createApplicant({
    externalUserId: user.id,
    levelName: KycLevelName_Enum.BasicKycLevel,
    email: user.email,
    lang,
  });
}
