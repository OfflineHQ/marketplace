export declare enum FeatureFlagsEnum {
  KYC = 'kyc',
}
export declare const FeatureFlagsValues: FeatureFlagsEnum.KYC[];
export type Flags = {
  [key in FeatureFlagsEnum]: boolean;
};
