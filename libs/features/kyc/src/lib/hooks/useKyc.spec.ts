import {
  createSumSubApplicant,
  getAccountKyc,
  getSumSubAccessToken,
  getSumSubApplicantPersonalData,
} from '@features/kyc-api';
import { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import { useKyc } from './useKyc';

jest.mock('@features/kyc-api', () => ({
  createSumSubApplicant: jest.fn(),
  getSumSubAccessToken: jest.fn(),
  getAccountKyc: jest.fn(),
  getSumSubApplicantPersonalData: jest.fn(),
}));
jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn(),
}));

const mockPersonalData = { lang: Locale.En };

describe('useKyc', () => {
  it('returns user and access token', async () => {
    const mockUser = { kyc: true };
    const mockToken = 'mockToken';

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });

  it('creates a SumSub applicant if user has no kyc', async () => {
    const mockUser = { kyc: false };
    const mockToken = 'mockToken';

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (createSumSubApplicant as jest.Mock).mockResolvedValue(null);

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(createSumSubApplicant).toHaveBeenCalledWith(Locale.En);
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });

  it('returns null user and empty access token if no user', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: null, accessToken: '' });
    expect(getCurrentUser).toHaveBeenCalled();
  });

  it('creates a new SumSub applicant if user has no existing kyc and getAccountKyc returns null', async () => {
    const mockUser = { kyc: null };
    const mockToken = 'mockToken';

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (getAccountKyc as jest.Mock).mockResolvedValue(null);
    (createSumSubApplicant as jest.Mock).mockResolvedValue({
      applicantId: 'mockApplicantId',
    });
    (getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue(
      mockPersonalData
    );

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(getAccountKyc).toHaveBeenCalled();
    expect(createSumSubApplicant).toHaveBeenCalledWith(Locale.En);
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });

  it('uses existing kyc if user has no existing kyc and getAccountKyc returns valid kyc', async () => {
    const mockUser = { kyc: null };
    const mockToken = 'mockToken';
    const mockKyc = { applicantId: 'mockApplicantId' };

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (getAccountKyc as jest.Mock).mockResolvedValue(mockKyc);
    (getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue(
      mockPersonalData
    );

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(getAccountKyc).toHaveBeenCalled();
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });

  it('uses existing kyc if user has existing kyc', async () => {
    const mockUser = { kyc: { applicantId: 'mockApplicantId' } };
    const mockToken = 'mockToken';

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue(
      mockPersonalData
    );

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });

  it('gets personal data if applicantId is not null and getSumSubApplicantPersonalData returns valid data', async () => {
    const mockUser = { kyc: { applicantId: 'mockApplicantId' } };
    const mockToken = 'mockToken';

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue(
      mockPersonalData
    );

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(getSumSubApplicantPersonalData).toHaveBeenCalledWith(
      mockUser.kyc.applicantId
    );
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });

  it('does not get personal data if applicantId is not null and getSumSubApplicantPersonalData returns null', async () => {
    const mockUser = { kyc: { applicantId: 'mockApplicantId' } };
    const mockToken = 'mockToken';

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (getSumSubAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue(null);

    const result = await useKyc(Locale.En);

    expect(result).toEqual({ user: mockUser, accessToken: mockToken });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(getSumSubApplicantPersonalData).toHaveBeenCalledWith(
      mockUser.kyc.applicantId
    );
    expect(getSumSubAccessToken).toHaveBeenCalled();
  });
});
