// libs/kyc/admin/src/lib/kyc-admin.spec.ts
import { adminSdk } from '@gql/admin/api';
import { KycLevelName_Enum, KycStatus_Enum, Locale } from '@gql/shared/types';
import { Kyc } from './kyc-admin';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    CreateKyc: jest.fn(),
    UpdateKyc: jest.fn(),
  },
}));

const fetchMock = jest.spyOn(global, 'fetch');

jest.mock('@crypto', () => ({
  getHmacDigestFromString: jest.fn().mockReturnValue('mocked_signature'),
}));

describe('Kyc', () => {
  const secretKey = 'test_secret_key';
  const appToken = 'test_app_token';
  const kyc = new Kyc({ secretKey, appToken });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should throw an error if secretKey or appToken is missing', () => {
    expect(() => new Kyc({ secretKey: '', appToken: '' })).toThrow(
      'Missing credentials',
    );
  });

  it('should create headers correctly', () => {
    const headers = kyc.headers({
      method: 'POST',
      uri: '/test',
      requestBody: 'test_body',
    });

    expect(headers).toEqual({
      'X-App-Token': appToken,
      'X-App-Access-Ts': expect.any(String),
      'X-App-Access-Sig': 'mocked_signature',
    });
  });

  it('should get access token correctly', async () => {
    const userId = 'test_user_id';
    const levelName = KycLevelName_Enum.BasicKycLevel;
    const mockResponse = { token: 'test_token' };
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const token = await kyc.getAccessToken({ userId, levelName });

    expect(fetchMock).toHaveBeenCalledWith(
      `${kyc.baseUrl}/resources/accessTokens?userId=${encodeURIComponent(
        userId,
      )}&levelName=${encodeURIComponent(levelName)}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...kyc.headers({
            method: 'POST',
            uri: '/resources/accessTokens',
            requestBody: `?userId=${encodeURIComponent(
              userId,
            )}&levelName=${encodeURIComponent(levelName)}`,
          }),
        },
      },
    );
    expect(token).toEqual(mockResponse.token);
  });

  it('should create an applicant correctly when there is no existing applicant', async () => {
    const externalUserId = 'test_user_id';
    const levelName = KycLevelName_Enum.BasicKycLevel;
    const email = 'test_email@example.com';
    const lang = Locale.En;
    const mockResponse = {
      id: 'test_applicant_id',
      review: {
        reviewStatus: 'test_status',
      },
      createdAt: 'test_date',
    };
    const mockKycRes = {
      reviewStatus: mockResponse.review.reviewStatus,
      applicantId: mockResponse.id,
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    // Add a check to ensure getApplicantPersonalDataByExternalUserId was called and threw an error
    const getApplicantPersonalDataByExternalUserIdSpy = jest
      .spyOn(kyc, 'getApplicantPersonalDataByExternalUserId')
      .mockRejectedValueOnce(new Error('404'));

    (adminSdk.CreateKyc as jest.Mock).mockResolvedValueOnce({
      insert_kyc_one: mockKycRes,
    });

    const kycRes = await kyc.createApplicant({
      externalUserId,
      levelName,
      email,
      lang,
    });

    expect(getApplicantPersonalDataByExternalUserIdSpy).toHaveBeenCalledWith(
      externalUserId,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `${kyc.baseUrl}/resources/applicants?levelName=${encodeURIComponent(
        levelName,
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...kyc.headers({
            method: 'POST',
            uri: '/resources/applicants',
            requestBody: JSON.stringify({
              externalUserId,
              email,
              lang,
            }),
          }),
        },
        body: JSON.stringify({
          externalUserId,
          email,
          lang,
        }),
      },
    );
    expect(adminSdk.CreateKyc).toHaveBeenCalledWith({
      kyc: {
        createDate: mockResponse.createdAt,
        reviewStatus: mockResponse.review.reviewStatus,
        externalUserId,
        levelName: KycLevelName_Enum.BasicKycLevel,
        applicantId: mockResponse.id,
      },
    });
    expect(kycRes).toEqual(mockKycRes);
  });

  it('should create an applicant correctly when there is an existing applicant', async () => {
    const externalUserId = 'test_user_id';
    const levelName = KycLevelName_Enum.BasicKycLevel;
    const email = 'test_email@example.com';
    const lang = Locale.En;
    const mockExistingApplicant = {
      externalUserId,
      id: 'existing_applicant_id',
      inspectionId: 'dummy',
      review: {
        reviewStatus: KycStatus_Enum.Init,
        reprocessing: false,
        createDate: 'dummy',
      },
      createdAt: 'existing_date',
    };

    const mockKycRes = {
      reviewStatus: mockExistingApplicant.review.reviewStatus,
      applicantId: mockExistingApplicant.id,
    };

    (adminSdk.CreateKyc as jest.Mock).mockResolvedValueOnce({
      insert_kyc_one: mockKycRes,
    });

    // Mock the getApplicantPersonalDataByExternalUserId method to return the existing applicant
    jest
      .spyOn(kyc, 'getApplicantPersonalDataByExternalUserId')
      .mockResolvedValueOnce(mockExistingApplicant);

    const kycRes = await kyc.createApplicant({
      externalUserId,
      levelName,
      email,
      lang,
    });

    expect(kycRes).toEqual(mockKycRes);

    expect(adminSdk.CreateKyc).toHaveBeenCalledWith({
      kyc: {
        createDate: mockExistingApplicant.createdAt,
        reviewStatus: mockExistingApplicant.review.reviewStatus,
        externalUserId,
        levelName: KycLevelName_Enum.BasicKycLevel,
        applicantId: mockExistingApplicant.id,
      },
    });

    expect(fetchMock).not.toHaveBeenCalled();

    // Expectations remain the same as the previous test
    // ...
  });
  it('should move an applicant to a new level correctly', async () => {
    const applicantId = 'test_applicant_id';
    const levelName = KycLevelName_Enum.AdvancedKycLevel;
    const mockResponse = {
      id: 'test_applicant_id',
      review: {
        reviewStatus: 'test_status',
      },
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const applicant = await kyc.moveApplicantToLevel({
      applicantId,
      levelName,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${kyc.baseUrl}/resources/applicants/${encodeURIComponent(
        applicantId,
      )}/moveToLevel?name=${encodeURIComponent(levelName)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...kyc.headers({
            method: 'POST',
            uri: `/resources/applicants/${encodeURIComponent(
              applicantId,
            )}/moveToLevel`,
            requestBody: `?name=${encodeURIComponent(levelName)}`,
          }),
        },
      },
    );
    expect(applicant).toEqual(mockResponse);
    expect(adminSdk.UpdateKyc).toHaveBeenCalledWith({
      externalUserId: mockResponse.id,
      kyc: {
        reviewStatus: mockResponse.review.reviewStatus,
        levelName: KycLevelName_Enum.AdvancedKycLevel,
      },
    });
  });
  it('should get an applicant status correctly', async () => {
    const applicantId = 'test_applicant_id';
    const mockResponse = { reviewStatus: 'completed' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const status = await kyc.getApplicantStatus(applicantId);

    expect(fetchMock).toHaveBeenCalledWith(
      `${kyc.baseUrl}/resources/applicants/${encodeURIComponent(
        applicantId,
      )}/status`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...kyc.headers({
            method: 'GET',
            uri: `/resources/applicants/${encodeURIComponent(
              applicantId,
            )}/status`,
          }),
        },
      },
    );
    expect(status).toEqual(mockResponse);
  });
  it('should get an applicant personal data correctly', async () => {
    const applicantId = 'test_applicant_id';
    const mockResponse = { firstName: 'John', lastName: 'Doe' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const personalData = await kyc.getApplicantPersonalData(applicantId);

    expect(fetchMock).toHaveBeenCalledWith(
      `${kyc.baseUrl}/resources/applicants/${encodeURIComponent(
        applicantId,
      )}/one`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...kyc.headers({
            method: 'GET',
            uri: `/resources/applicants/${encodeURIComponent(applicantId)}/one`,
          }),
        },
      },
    );
    expect(personalData).toEqual(mockResponse);
  });
  it('should get an applicant personal data by external user id correctly', async () => {
    const externalUserId = 'test_external_user_id';
    const mockResponse = { firstName: 'John', lastName: 'Doe' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const personalData =
      await kyc.getApplicantPersonalDataByExternalUserId(externalUserId);

    expect(fetchMock).toHaveBeenCalledWith(
      `${
        kyc.baseUrl
      }/resources/applicants/-;externalUserId=${encodeURIComponent(
        externalUserId,
      )}/one`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...kyc.headers({
            method: 'GET',
            uri: `/resources/applicants/-;externalUserId=${encodeURIComponent(
              externalUserId,
            )}/one`,
          }),
        },
      },
    );
    expect(personalData).toEqual(mockResponse);
  });
});
