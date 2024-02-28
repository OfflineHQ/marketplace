'use client';

import env from '@env/client';
import { AppUser } from '@next/types';
import * as encoding from '@walletconnect/encoding';
import {
  buildApprovedNamespaces,
  getSdkError,
  parseUri,
} from '@walletconnect/utils';
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

  const disconnectWalletConnect = useCallback(
    async (targetDAppIdentifier = null) => {
      try {
        console.log('Disconnecting WalletConnect sessions...');
        if (!web3wallet) return;

        const activeSessions = web3wallet.getActiveSessions();
        const disconnectPromises = Object.entries(activeSessions)
          .filter(([topic, session]) => {
            // If targetDAppIdentifier is provided, filter sessions by some criteria
            // For example, checking if the session's peerMeta contains the targetDAppIdentifier
            // This is a placeholder condition. Adjust according to your actual criteria.
            return targetDAppIdentifier
              ? session.peer.metadata.url.includes(targetDAppIdentifier)
              : true;
          })
          .map(([topic, session]) =>
            web3wallet.disconnectSession({
              topic,
              reason: getSdkError('USER_DISCONNECTED'),
            }),
          );

        await Promise.all(disconnectPromises);
        console.log('Disconnected from WalletConnect sessions.');
      } catch (error) {
        console.error('Failed to disconnect WalletConnect sessions: ', error);
      }
    },
    [],
  );

  const connectToDapp = useCallback(
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
      web3wallet.on('session_delete', async (event) => {
        console.log('session_delete:', event);
        const { topic } = event;
        await web3wallet.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
      });
      web3wallet.on('session_proposal', ({ id, params, verifyContext }) => {
        const {
          verified: { origin },
        } = verifyContext;
        console.log(`session_proposal from "${origin}":`, {
          id,
          params,
          verifyContext,
        });
        console.log('activeProposals:', activeProposals);
        // Check if the proposal has already been handled
        if (!activeProposals[id]) {
          setActiveProposals((prev) => ({ ...prev, [id]: true }));
          onApprove({ id, params, verifyContext });
        } else {
          console.log(`Proposal ${id} is already being processed.`);
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
        console.log('session_request:', event);
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

      web3wallet.on('session_request_expire', (event) => {
        // request expired and any modal displaying it should be removed
        const { id } = event;
        console.log('session_request_expire:', event);
      });

      // Check if a pairing already exists for the given topic
      const existingPairing = web3wallet.core.pairing
        .getPairings()
        .find((p) => p.topic === pairingTopic && p.active);
      if (existingPairing) {
        console.log(
          `Pairing already exists for topic: ${pairingTopic}. Using existing pairing.`,
        );
        // Optionally, handle the existing pairing here (e.g., proceed with session proposal)
        // For now, just return to avoid creating a new pairing
        return;
      }

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
    connectToDapp,
    disconnectWalletConnect,
    loading,
    onApprove,
    isLoadingApprove,
  };
};
