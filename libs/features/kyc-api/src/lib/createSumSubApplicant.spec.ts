import { KycLevelName_Enum, Locale } from '@gql/shared/types';
import { Kyc } from '@kyc/admin';
import { getCurrentUser } from '@next/next-auth/user';
import { createSumSubApplicant } from './createSumSubApplicant';

jest.mock('@next/next-auth/user');
jest.mock('@kyc/admin');

describe('createSumSubApplicant', () => {
  it('should create a new applicant if user does not have an applicantId', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      kyc: null,
    };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    const mockApplicant = {
      id: 'applicantId',
      review: { reviewStatus: 'status' },
      createdAt: 'date',
    };
    const mockKyc = {
      createApplicant: jest.fn().mockResolvedValue(mockApplicant),
    };
    (Kyc as jest.Mock).mockImplementation(() => mockKyc);

    await createSumSubApplicant(Locale.En);
    expect(mockKyc.createApplicant).toHaveBeenCalledWith({
      externalUserId: mockUser.id,
      levelName: KycLevelName_Enum.BasicKycLevel,
      email: mockUser.email,
      lang: Locale.En,
    });
  });

  it('should throw an error if user is not found', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    await expect(createSumSubApplicant()).rejects.toThrow('User not found');
  });

  it('should throw an error if user already has an applicantId', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({
      kyc: { applicantId: '123' },
    });

    await expect(createSumSubApplicant()).rejects.toThrow(
      'User already have an applicantId',
    );
  });
});
