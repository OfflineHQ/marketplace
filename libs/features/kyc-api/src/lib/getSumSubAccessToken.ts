'use server';

import { KycLevelName_Enum } from '@gql/shared/types';
import { GetAccessTokenProps, Kyc } from '@kyc/admin';
import { getCurrentUser } from '@next/next-auth/user';
import { getAccountKyc } from './getAccountKyc';

export async function getSumSubAccessToken() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }
  let getAccesToken: GetAccessTokenProps | null = null;
  // either the user session have the kyc loaded
  if (user.kyc) {
    getAccesToken = {
      userId: user.id,
      levelName: user.kyc.levelName || KycLevelName_Enum.BasicKycLevel,
    };
  }
  // or it exist but it's not been updated into the session cookie, in that case retrieve it
  else {
    const kycUser = await getAccountKyc();
    if (!kycUser || !kycUser.applicantId) {
      throw new Error('User has no applicantId');
    }
    getAccesToken = {
      userId: user.id,
      levelName: kycUser.levelName || KycLevelName_Enum.BasicKycLevel,
    };
  }
  const kyc = new Kyc({
    secretKey: process.env.SUMSUB_SECRET_KEY as string,
    appToken: process.env.SUMSUB_API_KEY as string,
  });
  //TODO get level name from user
  return await kyc.getAccessToken(getAccesToken);
}
