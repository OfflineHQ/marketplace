'use client';

import env from '@env/client';
import { AppUser } from '@next/types';
import * as encoding from '@walletconnect/encoding';
import { SessionTypes } from '@walletconnect/types';
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
  const [isConnectedToDapp, setIsConnectedToDapp] = useState(false);
  const [isLoadingPairing, setIsLoadingPairing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentPairingTopic, setCurrentPairingTopic] = useState('');
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const { wallet } = useWalletContext();

  // Function to check if any active session matches the embedding page URL
  const getSessionMatchingAddressAndDapp = (
    sessions: SessionTypes.Struct[],
    dappUrl: string,
    address: string,
  ) => {
    const existingSession = sessions.find((session) => {
      const sessionUrl = session.peer.metadata.url; // The URL associated with the dApp in the session
      // Simple comparison, might need adjustments based on how URLs are stored and used
      return sessionUrl === dappUrl || dappUrl.includes(sessionUrl);
    });
    if (!existingSession) return null;
    // Check if the session's account matches your wallet's address
    return existingSession.namespaces.eip155.accounts.some((account) => {
      const accountAddress = account.split(':')[2]; // Splitting 'eip155:80001:0xD48840d7b9E2ad0B79393c2D2F0cD0f604Ec7956' to get the address
      return accountAddress.toLowerCase() === address.toLowerCase();
    })
      ? existingSession
      : null;
  };

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
          setIsConnectedToDapp(true);
          console.log('session:', session);
          // After successful approval, remove the proposal from activeProposals
        } catch (e) {
          console.error('Failed to approve session:', e);
          setIsLoadingApprove(false);
          return;
        }
      }
      setIsLoadingApprove(false);
    },
    [address],
  );

  const initializeWalletConnect = useCallback(async () => {
    try {
      if (!web3wallet) {
        await createWeb3Wallet('');
      }
      console.log('WalletConnect initialized:', web3wallet);
      const activeSessions = web3wallet.getActiveSessions();
      console.log('WalletConnect active sessions:', activeSessions);
      setIsReady(true);
      const embeddingPageUrl = document.referrer; // URL of the page embedding the iframe
      console.log('embeddingPageUrl:', embeddingPageUrl);
      if (embeddingPageUrl) {
        const existingSession = getSessionMatchingAddressAndDapp(
          Object.values(activeSessions),
          embeddingPageUrl,
          address,
        );
        if (existingSession) {
          console.log(
            `initializeWalletConnect // Existing session found for dApp: ${embeddingPageUrl}. Using existing session.`,
          );
          setIsConnectedToDapp(true);
        }
      }
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
        setIsConnectedToDapp(false);
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
        const sessionDApp = verifyContext.verified.origin;
        const activeSessions = web3wallet.getActiveSessions();
        const existingSession = getSessionMatchingAddressAndDapp(
          Object.values(activeSessions),
          sessionDApp,
          address,
        );
        if (existingSession) {
          console.log(
            `connectToDapp // Existing session found for dApp: ${sessionDApp}. Using existing session.`,
          );
          setIsConnectedToDapp(true);
          // Optionally, handle the existing session here (e.g., proceed with interaction without new session proposal)
        } else {
          onApprove({ id, params, verifyContext });
        }
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
        setIsLoadingPairing(true);
        web3wallet.core.pairing.events.on(
          'pairing_expire',
          pairingExpiredListener,
        );
        await web3wallet.pair({ uri });
      } catch (error) {
        console.error('Failed to connect to WalletConnect: ', error);
      } finally {
        setIsLoadingPairing(false);
      }
    },
    [wallet, address, onApprove],
  );

  return {
    isConnectedToDapp,
    isReady,
    web3wallet,
    initializeWalletConnect,
    connectToDapp,
    disconnectWalletConnect,
    isLoadingPairing,
    isLoadingApprove,
  };
};
