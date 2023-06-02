import type { ExternalProvider } from '@ethersproject/providers';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
    STORYBOOK_ENV?: boolean;
  }
}
