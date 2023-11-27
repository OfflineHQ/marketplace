import { KycLevelName_Enum, KycStatus_Enum } from '@gql/shared/types';
import { AppUser } from '@next/types';
import { isUserKycPending, isUserKycValidated } from './index';

describe('KYC status functions', () => {
  const userValidated = {
    id: 'dummy',
    address: 'dummy',
    kyc: {
      levelName: KycLevelName_Enum.BasicKycLevel,
      reviewStatus: KycStatus_Enum.Completed,
      applicantId: 'dummy',
    },
  } satisfies AppUser;

  const userPending = {
    id: 'dummy',
    address: 'dummy',
    kyc: {
      levelName: KycLevelName_Enum.BasicKycLevel,
      reviewStatus: KycStatus_Enum.Pending,
      applicantId: 'dummy',
    },
  } satisfies AppUser;

  const userNoKYC = {
    id: 'dummy',
    address: 'dummy',
    kyc: null,
  } satisfies AppUser;

  it('should return true if user KYC is validated', () => {
    expect(isUserKycValidated(userValidated)).toBe(true);
  });

  it('should return false if user KYC is not validated', () => {
    expect(isUserKycValidated(userPending)).toBe(false);
    expect(isUserKycValidated(userNoKYC)).toBe(false);
  });

  it('should return true if user KYC is pending', () => {
    expect(isUserKycPending(userPending)).toBe(true);
  });

  it('should return false if user KYC is not pending', () => {
    expect(isUserKycPending(userValidated)).toBe(false);
    expect(isUserKycPending(userNoKYC)).toBe(false);
  });

  it('should return true if user KYC is completed and levelName matches', () => {
    expect(
      isUserKycValidated(userValidated, KycLevelName_Enum.BasicKycLevel),
    ).toBe(true);
  });
  it('should return true if user KYC is completed and levelName advanced matches', () => {
    expect(
      isUserKycValidated(
        {
          ...userValidated,
          kyc: {
            ...userValidated.kyc,
            levelName: KycLevelName_Enum.AdvancedKycLevel,
          },
        },
        KycLevelName_Enum.AdvancedKycLevel,
      ),
    ).toBe(true);
  });
  it('should return false if user KYC is completed but levelName does not match', () => {
    expect(
      isUserKycValidated(userValidated, KycLevelName_Enum.AdvancedKycLevel),
    ).toBe(false);
  });
});
