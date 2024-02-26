'use client';

import env from '@env/client';
import * as encoding from '@walletconnect/encoding';
import { buildApprovedNamespaces, parseUri } from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { useCallback, useState } from 'react';
import { createWeb3Wallet, web3wallet } from '../utils/WalletConnectUtil';
import { useWalletContext } from './useWalletContext';

export function convertHexToUtf8(hex: string) {
  try {
    return encoding.hexToUtf8(hex);
  } catch (e) {
    return hex;
  }
}

export const useWalletConnect = (address: string) => {
  const [loading, setLoading] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const { wallet } = useWalletContext();
  const signer = wallet?.signer;

  const initializeWalletConnect = useCallback(async () => {
    setLoading(true);
    try {
      await createWeb3Wallet('');
      console.log('WalletConnect initialized:', web3wallet);
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize WalletConnect: ', error);
      setLoading(false);
    }
  }, []);

  const connectToWallet = useCallback(async (uri: string) => {
    const { topic: pairingTopic } = parseUri(uri);
    // if for some reason, the proposal is not received, we need to close the modal when the pairing expires (5mins)
    const pairingExpiredListener = ({ topic }: { topic: string }) => {
      if (pairingTopic === topic) {
        console.log('pairing expired');
        //     styledToast('Pairing expired. Please try again with new Connection URI', 'error')
        //     ModalStore.close()
        web3wallet.core.pairing.events.removeListener(
          'pairing_expire',
          pairingExpiredListener,
        );
      }
    };
    web3wallet.on('session_proposal', (args) => {
      console.log('session_proposal:', args);
      onApprove(args);
      web3wallet.core.pairing.events.removeListener(
        'pairing_expire',
        pairingExpiredListener,
      );
    });
    // Handle session request

    web3wallet.on('session_request', async (event) => {
      if (!signer) {
        console.error('No signer found');
        return;
      }
      const { topic, params, id } = event;
      const { request } = params;
      const requestParamsMessage = request.params[0];

      // convert `requestParamsMessage` by using a method like hexToUtf8
      const message = convertHexToUtf8(requestParamsMessage);

      // sign the message
      const signedMessage = await signer.signMessage(message);

      const response = { id, result: signedMessage, jsonrpc: '2.0' };
      console.log('response:', response);

      await web3wallet.respondSessionRequest({ topic, response });
    });

    try {
      setLoading(true);
      web3wallet.core.pairing.events.on(
        'pairing_expire',
        pairingExpiredListener,
      );
      await web3wallet.pair({ uri });
    } catch (error) {
      console.error('Failed to connect to WalletConnect: ', error);
      //   styledToast((error as Error).message, 'error')
      //   ModalStore.close()
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle approve action, construct session namespace
  const onApprove = useCallback(
    async (proposal: Web3WalletTypes.SessionProposal) => {
      if (proposal) {
        setIsLoadingApprove(true);
        // ------- namespaces builder util ------------ //
        const namespaces = buildApprovedNamespaces({
          proposal: proposal.params,
          supportedNamespaces: {
            eip155: {
              chains: [`eip155:${env.NEXT_PUBLIC_CHAIN}`],
              methods: [
                'personal_sign',
                'eth_sign',
                'eth_signTypedData',
                'eth_signTypedData_v4',
                'eth_sendTransaction',
              ],
              events: ['accountsChanged', 'chainChanged'],
              accounts: [`eip155:${env.NEXT_PUBLIC_CHAIN}:${address}`],
            },
          },
        });

        console.log('approving namespaces:', namespaces);

        try {
          const session = await web3wallet.approveSession({
            id: proposal.id,
            namespaces,
          });
          console.log('session:', session);
          //     SettingsStore.setSessions(Object.values(web3wallet.getActiveSessions()))
        } catch (e) {
          console.error('Failed to approve session:', e);
          setIsLoadingApprove(false);
          //     styledToast((e as Error).message, 'error')
          return;
        }
      }
      setIsLoadingApprove(false);
      // ModalStore.close()
    },
    [address],
  );

  return {
    initializeWalletConnect,
    connectToWallet,
    loading,
    onApprove,
    isLoadingApprove,
  };
};
