import { KycStatus_Enum } from '@gql/shared/types';
import { Kyc } from '@kyc/admin';
import { AppUser } from '@next/types';
import { isApplicantPending } from './middlewares/isApplicantPending';
import { updateApplicantToLevel } from './updateApplicantToLevel';

jest.mock('@next/next-auth/user');
jest.mock('./middlewares/isApplicantPending');
jest.mock('@kyc/admin');

describe('updateApplicantToLevel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws an error if user is not found', async () => {
    const user = null;

    await expect(updateApplicantToLevel(user)).rejects.toThrow(
      'User not found',
    );
  });

  it('throws an error if user has no applicantId', async () => {
    const user = { kyc: {} };

    await expect(updateApplicantToLevel(user as AppUser)).rejects.toThrow(
      'User has no applicantId',
    );
  });

  it('throws an error if user kyc is pending', async () => {
    const user = {
      kyc: { applicantId: '123', reviewStatus: KycStatus_Enum.Pending },
    };
    (isApplicantPending as jest.Mock).mockReturnValue(true);

    await expect(updateApplicantToLevel(user as AppUser)).rejects.toThrow(
      'User kyc is pending',
    );
  });

  it('returns an applicant if user kyc is not pending', async () => {
    const user = {
      kyc: { applicantId: '123', reviewStatus: KycStatus_Enum.Completed },
    };
    (isApplicantPending as jest.Mock).mockReturnValue(false);
    (Kyc.prototype.moveApplicantToLevel as jest.Mock).mockResolvedValue(
      'applicant',
    );

    const result = await updateApplicantToLevel(user as AppUser);

    expect(result).toBe('applicant');
  });
});
