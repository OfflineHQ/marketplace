import { Eip1193Provider } from 'ethers6';

declare global {
  interface Window {
    ethereumProviderMock?: Eip1193Provider;
    useE2EAuthContext?: () => Promise<string>;
  }
}
