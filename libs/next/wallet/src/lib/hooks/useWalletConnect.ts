'use client';

import env from '@env/client';
import { AppUser } from '@next/types';
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

export type UseWalletConnectProps = Pick<AppUser, 'address'>;

export const useWalletConnect = ({ address }: UseWalletConnectProps) => {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentPairingTopic, setCurrentPairingTopic] = useState('');
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [activeProposals, setActiveProposals] = useState<
    Record<string, boolean>
  >({});
  const { wallet } = useWalletContext();

  const initializeWalletConnect = useCallback(async () => {
    try {
      await createWeb3Wallet('');
      console.log('WalletConnect initialized:', web3wallet);
      console.log(
        'WalletConnect active sessions:',
        web3wallet.getActiveSessions(),
      );
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize WalletConnect: ', error);
      setIsReady(false);
    }
  }, []);

  const disconnectWalletConnect = useCallback(async () => {
    try {
      if (!web3wallet || !currentPairingTopic) return;
      web3wallet.core.pairing.events.removeAllListeners();
      await web3wallet.core.pairing.disconnect({
        topic: currentPairingTopic,
      });
      console.log('WalletConnect disconnected');
      setCurrentPairingTopic('');
    } catch (error) {
      console.error('Failed to disconnect WalletConnect: ', error);
    }
  }, [currentPairingTopic]);

  const connectToWallet = useCallback(
    async (uri: string) => {
      const { topic: pairingTopic } = parseUri(uri);
      setCurrentPairingTopic(pairingTopic);
      // if for some reason, the proposal is not received, we need to close the modal when the pairing expires (5mins)
      const pairingExpiredListener = ({ topic }: { topic: string }) => {
        if (pairingTopic === topic) {
          console.log('pairing expired');
          web3wallet.core.pairing.events.removeListener(
            'pairing_expire',
            pairingExpiredListener,
          );
        }
      };
      web3wallet.on('session_proposal', (args) => {
        console.log('session_proposal:', args);
        // Check if the proposal has already been handled
        if (!activeProposals[args.id]) {
          setActiveProposals((prev) => ({ ...prev, [args.id]: true }));
          onApprove(args);
        } else {
          console.log(`Proposal ${args.id} is already being processed.`);
        }
        web3wallet.core.pairing.events.removeListener(
          'pairing_expire',
          pairingExpiredListener,
        );
      });
      // Handle session request

      web3wallet.on('session_request', async (event) => {
        if (!wallet) {
          console.error('No signer found');
          return;
        }
        const { topic, params, id } = event;
        const { request } = params;
        const requestParamsMessage = request.params[0];

        // convert `requestParamsMessage` by using a method like hexToUtf8
        const message = convertHexToUtf8(requestParamsMessage);

        // sign the message
        const signedMessage = await wallet.signMessage(message);

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
      } finally {
        setLoading(false);
      }
    },
    [activeProposals, wallet, address],
  );

  // Handle approve action, construct session namespace
  const onApprove = useCallback(
    async (proposal: Web3WalletTypes.SessionProposal) => {
      if (proposal) {
        setIsLoadingApprove(true);
        // ------- namespaces builder util ------------ //
        const namespaces = buildApprovedNamespaces({
          proposal: { ...proposal.params, expiry: proposal.params.expiry || 0 },
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
          // After successful approval, remove the proposal from activeProposals
          setActiveProposals((prev) => {
            const updatedProposals = { ...prev };
            delete updatedProposals[proposal.id];
            return updatedProposals;
          });
        } catch (e) {
          console.error('Failed to approve session:', e);
          setIsLoadingApprove(false);
          // If approval fails, also remove the proposal to allow retry
          setActiveProposals((prev) => {
            const updatedProposals = { ...prev };
            delete updatedProposals[proposal.id];
            return updatedProposals;
          });
          return;
        }
      }
      setIsLoadingApprove(false);
    },
    [address],
  );

  return {
    isReady,
    web3wallet,
    initializeWalletConnect,
    connectToWallet,
    disconnectWalletConnect,
    loading,
    onApprove,
    isLoadingApprove,
  };
};
