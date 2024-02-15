import { handleAccount } from '@features/account/api';
import { KycStatus_Enum } from '@gql/shared/types';
import { getSumSubApplicantPersonalData } from '@next/next-auth/common';
import { SiweProvider } from './siweProvider';

const isValidSignatureMock = jest.fn().mockResolvedValue(true);

jest.mock('@features/account/api');
jest.mock('@next/next-auth/common');
jest.mock('@smart-wallet/admin', () => ({
  SmartWallet: jest.fn().mockImplementation(() => ({
    isValidSignature: isValidSignatureMock,
  })),
}));

describe('SiweProvider', () => {
  const credentials = {
    message: 'test message',
    signature: 'test signature',
    address: 'test address',
  };
  const req = {};

  it('should authorize user with valid signature', async () => {
    const appUser = {
      kyc: {
        applicantId: 'test applicantId',
        reviewStatus: KycStatus_Enum.Completed,
      },
    };
    (handleAccount as jest.Mock).mockResolvedValue(appUser);
    (getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue({
      email: 'test email',
      phone: 'test phone',
    });
    const result = await SiweProvider().options.authorize(credentials, req);

    expect(handleAccount).toHaveBeenCalledWith({
      address: credentials.address,
    });
    expect(getSumSubApplicantPersonalData).toHaveBeenCalledWith(
      appUser.kyc.applicantId,
    );
    expect(result).toEqual({
      ...appUser,
      email: 'test email',
      phone: 'test phone',
    });
  });

  it('should throw error if API call fails', async () => {
    isValidSignatureMock.mockRejectedValue(
      new Error('API call failed with status: 500'),
    );
    await expect(
      SiweProvider().options.authorize(credentials, req),
    ).rejects.toThrowError('API call failed with status: 500');
  });

  it('should throw error if credentials are missing or invalid', async () => {
    await expect(
      SiweProvider().options.authorize(
        {} as { message: string; signature: string; address: string },
        req,
      ),
    ).rejects.toThrowError('Missing or invalid credentials');
  });

  it('should throw error if isValidSignature returns unsuccessful response', async () => {
    isValidSignatureMock.mockResolvedValue(false);
    await expect(
      SiweProvider().options.authorize(credentials, req),
    ).rejects.toThrowError();
  });
});
