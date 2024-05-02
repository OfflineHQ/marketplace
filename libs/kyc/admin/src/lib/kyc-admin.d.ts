import { CreateKycMutation } from '@gql/admin/types';
import { Locale } from '@gql/shared/types';
import type {
  Applicant,
  ApplicantPersonalData,
  ApplicantReviewStatus,
  LevelName,
} from '@kyc/types';
export interface GetAccessTokenProps {
  userId: string;
  levelName: LevelName;
}
export declare class Kyc {
  private secretKey;
  private appToken;
  baseUrl: string;
  constructor({ secretKey, appToken }: { secretKey: string; appToken: string });
  headers({
    method,
    uri,
    requestBody,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    uri: string;
    requestBody?: string;
  }): Record<string, string>;
  getAccessToken({ userId, levelName }: GetAccessTokenProps): Promise<string>;
  createApplicant({
    externalUserId,
    levelName,
    email,
    lang,
  }: {
    externalUserId: string;
    levelName: LevelName;
    email?: string;
    lang?: Locale;
  }): Promise<CreateKycMutation['insert_kyc_one']>;
  moveApplicantToLevel({
    applicantId,
    levelName,
  }: {
    applicantId: string;
    levelName: LevelName;
  }): Promise<Applicant>;
  getApplicantStatus(applicantId: string): Promise<ApplicantReviewStatus>;
  getApplicantPersonalData(applicantId: string): Promise<ApplicantPersonalData>;
  getApplicantPersonalDataByExternalUserId(
    externalUserId: string,
  ): Promise<ApplicantPersonalData>;
}
