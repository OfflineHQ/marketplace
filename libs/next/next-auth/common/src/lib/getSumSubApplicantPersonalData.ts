'use server';

import { Kyc } from '@kyc/admin';
import env from '@env/server';

export async function getSumSubApplicantPersonalData(applicantId: string) {
  const kyc = new Kyc({
    secretKey: env.SUMSUB_SECRET_KEY,
    appToken: env.SUMSUB_API_KEY,
  });
  //TODO get level name from user
  return await kyc.getApplicantPersonalData(applicantId);
}
