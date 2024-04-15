import { KycLevelName_Enum } from '@gql/shared/types';
import { AppUser } from '@next/types';
export declare function isUserKycValidated(
  user: AppUser | undefined,
  levelName?: KycLevelName_Enum,
): boolean;
export declare function isUserKycPending(user: AppUser | undefined): boolean;
