import { KycLevelName_Enum, KycStatus_Enum } from '@gql/shared/types';
import { AppUser } from '@next/types';

export function isUserKycValidated(
  user: AppUser | undefined,
  levelName?: KycLevelName_Enum,
) {
  if (levelName && user?.kyc?.levelName !== levelName) return false;
  const status = user?.kyc?.reviewStatus;
  return !(!status || status !== KycStatus_Enum.Completed);
}

export function isUserKycPending(user: AppUser | undefined) {
  const status = user?.kyc?.reviewStatus;
  return !(!status || status !== KycStatus_Enum.Pending);
}
