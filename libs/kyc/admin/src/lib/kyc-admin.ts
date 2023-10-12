import { getHmacDigestFromString } from '@crypto';
import { adminSdk } from '@gql/admin/api';
import { CreateKycMutation } from '@gql/admin/types';
import { KycLevelName_Enum, Kyc_Insert_Input, Locale } from '@gql/shared/types';
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

export class Kyc {
  private secretKey: string;
  private appToken: string;
  public baseUrl = 'https://api.sumsub.com';

  constructor({
    secretKey,
    appToken,
  }: {
    secretKey: string;
    appToken: string;
  }) {
    if (!secretKey || !appToken) throw new Error('Missing credentials');
    this.secretKey = secretKey;
    this.appToken = appToken;
  }

  headers({
    method,
    uri,
    requestBody = '',
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    uri: string;
    requestBody?: string;
  }): Record<string, string> {
    const ts = Math.floor(Date.now() / 1000);

    // Concatenate the string to be signed
    const stringToSign = `${ts}${method}${uri}${requestBody}`;

    const signature = getHmacDigestFromString({
      secret: this.secretKey,
      string: stringToSign,
    });
    return {
      'X-App-Token': this.appToken,
      'X-App-Access-Ts': ts.toString(),
      'X-App-Access-Sig': signature,
    };
  }

  async getAccessToken({
    userId,
    levelName,
  }: GetAccessTokenProps): Promise<string> {
    const userIdEncoded = encodeURIComponent(userId);
    const levelNameEncoded = encodeURIComponent(levelName);
    const method = 'POST';
    const uri = '/resources/accessTokens';
    const requestBody = `?userId=${userIdEncoded}&levelName=${levelNameEncoded}`;
    const headers = this.headers({ method, uri, requestBody });
    const response = await fetch(`${this.baseUrl}${uri}${requestBody}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
    const data = await response.json();
    return data?.token as string;
  }

  async createApplicant({
    externalUserId,
    levelName,
    email,
    lang,
  }: {
    externalUserId: string;
    levelName: LevelName;
    email?: string;
    lang?: Locale;
  }): Promise<CreateKycMutation['insert_kyc_one']> {
    const method = 'POST';
    const uri = `/resources/applicants?levelName=${encodeURIComponent(
      levelName
    )}`;
    const requestBody = JSON.stringify({
      externalUserId,
      email,
      lang,
    });

    const headers = this.headers({ method, uri, requestBody });
    let existingApplicant: ApplicantPersonalData | null = null;
    let kyc: Kyc_Insert_Input = {
      levelName: KycLevelName_Enum.BasicKycLevel,
      externalUserId,
    };
    try {
      existingApplicant = await this.getApplicantPersonalDataByExternalUserId(
        externalUserId
      );
      kyc = {
        reviewStatus: existingApplicant.review.reviewStatus,
        applicantId: existingApplicant.id,
        createDate: existingApplicant.createdAt,
        ...kyc,
      };
    } catch (e) {
      // if the error is something else than that the applicant is not found pass down the error
      if (!e.message?.includes('404')) {
        throw e;
      }
    }
    if (!existingApplicant) {
      const response = await fetch(`${this.baseUrl}${uri}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: requestBody,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Applicant = await response.json();
      kyc = {
        reviewStatus: data.review.reviewStatus,
        applicantId: data.id,
        createDate: data.createdAt,
        ...kyc,
      };
    }
    const kycRes = await adminSdk.CreateKyc({
      kyc,
    });
    return kycRes.insert_kyc_one;
  }
  async moveApplicantToLevel({
    applicantId,
    levelName,
  }: {
    applicantId: string;
    levelName: LevelName;
  }): Promise<Applicant> {
    const method = 'POST';
    const uri = `/resources/applicants/${encodeURIComponent(
      applicantId
    )}/moveToLevel`;

    const requestBody = `?name=${encodeURIComponent(levelName)}`;
    const headers = this.headers({ method, uri, requestBody });

    const response = await fetch(`${this.baseUrl}${uri}${requestBody}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Applicant = await response.json();
    await adminSdk.UpdateKyc({
      externalUserId: data.id,
      kyc: {
        levelName,
        reviewStatus: data.review.reviewStatus,
      },
    });
    return data;
  }
  async getApplicantStatus(
    applicantId: string
  ): Promise<ApplicantReviewStatus> {
    const method = 'GET';
    const uri = `/resources/applicants/${encodeURIComponent(
      applicantId
    )}/status`;
    const headers = this.headers({ method, uri });
    const response = await fetch(`${this.baseUrl}${uri}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApplicantReviewStatus = await response.json();
    return data;
  }

  async getApplicantPersonalData(
    applicantId: string
  ): Promise<ApplicantPersonalData> {
    const method = 'GET';
    const uri = `/resources/applicants/${encodeURIComponent(applicantId)}/one`;
    const headers = this.headers({ method, uri });
    const response = await fetch(`${this.baseUrl}${uri}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApplicantPersonalData = await response.json();
    return data;
  }

  async getApplicantPersonalDataByExternalUserId(
    externalUserId: string
  ): Promise<ApplicantPersonalData> {
    const method = 'GET';
    const uri = `/resources/applicants/-;externalUserId=${encodeURIComponent(
      externalUserId
    )}/one`;
    const headers = this.headers({ method, uri });
    const response = await fetch(`${this.baseUrl}${uri}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApplicantPersonalData = await response.json();
    return data;
  }
}
