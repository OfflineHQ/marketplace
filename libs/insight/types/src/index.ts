export enum FeatureFlagsEnum {
  KYC = 'kyc', // kyc feature with sumsub
}

export const FeatureFlagsValues = Object.values(FeatureFlagsEnum);

export type Flags = {
  [key in FeatureFlagsEnum]: boolean;
};
