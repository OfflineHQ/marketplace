'use server';

import { Kyc } from '@kyc/admin';

export async function getSumSubApplicantPersonalData(applicantId: string) {
  const kyc = new Kyc({
    secretKey: process.env.SUMSUB_SECRET_KEY as string,
    appToken: process.env.SUMSUB_API_KEY as string,
  });
  //TODO get level name from user
  return await kyc.getApplicantPersonalData(applicantId);
}
