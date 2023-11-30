import type { ExternalProvider } from '@ethersproject/providers';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
    useE2EAuthContext?: () => Promise<string>;
  }
}
