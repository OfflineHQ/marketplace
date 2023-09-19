import { adminSdk } from '@gql/admin/api';
import { KycStatus_Enum } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import { handleApplicantStatusChanged } from './handleApplicantStatusChanged';

jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn(),
}));
jest.mock('@gql/admin/api');

describe('handleApplicantStatusChanged', () => {
  beforeEach(() => {
    (adminSdk.UpdateKyc as jest.Mock).mockClear();
  });
  it('throws an error if user is not found', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      handleApplicantStatusChanged(KycStatus_Enum.Pending)
    ).rejects.toThrow('User not found');
  });

  it('throws an error if user does not have an applicant created', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValueOnce({ kyc: {} });

    await expect(
      handleApplicantStatusChanged(KycStatus_Enum.Pending)
    ).rejects.toThrow("User doesn't have an applicant created");
  });

  it('updates the user KYC status if it is different from the new status', async () => {
    const user = {
      id: '1',
      kyc: {
        applicantId: '1',
        reviewStatus: KycStatus_Enum.Completed,
      },
    };
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(user);
    (adminSdk.UpdateKyc as jest.Mock).mockResolvedValueOnce(true);

    const result = await handleApplicantStatusChanged(KycStatus_Enum.Pending);

    expect(adminSdk.UpdateKyc).toHaveBeenCalledWith({
      externalUserId: user.id,
      kyc: {
        reviewStatus: KycStatus_Enum.Pending,
      },
    });
    expect(result).toBe(true);
  });

  it('does not update the user KYC status if it is the same as the new status', async () => {
    const user = {
      id: '1',
      kyc: {
        applicantId: '1',
        reviewStatus: KycStatus_Enum.Pending,
      },
    };
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(user);

    const result = await handleApplicantStatusChanged(KycStatus_Enum.Pending);

    expect(adminSdk.UpdateKyc).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
