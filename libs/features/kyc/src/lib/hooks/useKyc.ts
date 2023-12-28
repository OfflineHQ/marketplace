import {
  createSumSubApplicant,
  getAccountKyc,
  getSumSubAccessToken,
  getSumSubApplicantPersonalData,
} from '@features/kyc-api';
import { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';

export const useKyc = async (locale: Locale) => {
  const user = await getCurrentUser();
  let applicantId: string | undefined | null = '';
  if (!user) return { user: null, accessToken: '' };
  if (!user.kyc) {
    // here check that user don't have an existing kyc
    const hasKyc = await getAccountKyc();
    // if it's not the case it can create one from an existing sumsub applicant or from a new sumsub applicant
    if (!hasKyc) {
      const applicant = await createSumSubApplicant(locale);
      applicantId = applicant?.applicantId;
      if (!applicantId) console.error(`user ${user.id} has no applicantId`);
    } else applicantId = hasKyc.applicantId;
  } else applicantId = user.kyc.applicantId;
  if (applicantId) {
    const userPersonalData = await getSumSubApplicantPersonalData(applicantId);
    const applicantLocale = userPersonalData?.lang
      ? (userPersonalData.lang as Locale)
      : undefined;
    // TODO, check how to update the applicant locale with lang, doesn't seem to exist on sumsub api
    if (!applicantLocale || applicantLocale !== locale) {
      console.log({ userPersonalData, locale });
    }
  }
  const accessToken = await getSumSubAccessToken();
  return { user, accessToken };
};
