import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import env from '@env/client';

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: env.NEXT_PUBLIC_WC_PROJECT_ID,
        chains: [Number(env.NEXT_PUBLIC_CHAIN)],
        showQrModal: false,
      },
    }),
);
