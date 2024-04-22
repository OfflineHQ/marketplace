export declare const SiweProvider: () => import('next-auth/providers/credentials').CredentialsConfig<{
  message: {
    label: string;
    type: string;
    placeholder: string;
  };
  signature: {
    label: string;
    type: string;
    placeholder: string;
  };
  address: {
    type: string;
  };
}>;
