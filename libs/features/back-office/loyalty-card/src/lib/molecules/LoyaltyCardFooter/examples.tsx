import * as walletProvider from '@next/wallet';
import { createMock } from 'storybook-addon-module-mock';
import * as deployApi from '../../actions/deployLoyaltyCardCollectionWrapper';

export function loyaltyCardFooterMocks() {
  const mockWallet = createMock(walletProvider, 'useWalletContext');
  mockWallet.mockReturnValue({
    provider: {
      getSigner: () => Promise.resolve({}),
    },
  });
  const mockDeployLoyaltyCardCollectionWrapper = createMock(
    deployApi,
    'deployLoyaltyCardCollectionWrapper',
  );
  mockDeployLoyaltyCardCollectionWrapper.mockResolvedValue(undefined);
  return [mockWallet, mockDeployLoyaltyCardCollectionWrapper];
}
