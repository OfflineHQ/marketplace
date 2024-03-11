'use client';

import env from '@env/client';
import * as encoding from '@walletconnect/encoding';
import { SessionTypes } from '@walletconnect/types';
import {
  buildApprovedNamespaces,
  getSdkError,
  parseUri,
} from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { useCallback, useEffect, useState } from 'react';
import { createWeb3Wallet, web3wallet } from '../utils/WalletConnectUtil';
import { useWalletContext } from './useWalletContext';

export function convertHexToUtf8(hex: string) {
  try {
    return encoding.hexToUtf8(hex);
  } catch (e) {
    return hex;
  }
}

export const useWalletConnect = () => {
  const [isConnectedToDapp, setIsConnectedToDapp] = useState(false);
  const [isLoadingPairing, setIsLoadingPairing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentPairingTopic, setCurrentPairingTopic] = useState('');
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const { wallet } = useWalletContext();

  const normalizeUrl = (url: string) => url.toLowerCase().replace(/\/$/, ''); // Remove trailing slash and convert to lowercase

  const getSessionMatchingAddressAndDapp = (
    sessions: SessionTypes.Struct[],
    dappUrl: string,
    address: string,
  ) => {
    const normalizedDappUrl = normalizeUrl(dappUrl);
    console.log({ sessions, normalizedDappUrl, address });

    const existingSession = sessions.find((session) => {
      const sessionUrl = normalizeUrl(session.peer.metadata.url); // Normalize session URL
      // Enhanced comparison to account for minor discrepancies
      return (
        sessionUrl === normalizedDappUrl ||
        normalizedDappUrl.includes(sessionUrl) ||
        sessionUrl.includes(normalizedDappUrl)
      );
    });

    if (!existingSession) return null;

    // Check if the session's account matches your wallet's address
    return existingSession.namespaces.eip155.accounts.some((account) => {
      const accountAddress = account.split(':')[2]; // Extracting the address
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
              accounts: [
                `eip155:${env.NEXT_PUBLIC_CHAIN}:${wallet?.getAddress()}`,
              ],
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
    [wallet?.getAddress()],
  );

  const initializeWalletConnect = useCallback(async (address: string) => {
    try {
      if (!web3wallet) {
        await createWeb3Wallet('');
      }
      console.log('WalletConnect initialized');
      const activeSessions = web3wallet.getActiveSessions();
      setIsReady(true);
      const embeddingPageUrl = document.referrer; // URL of the page embedding the iframe
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
              ? session.peer.metadata.url.includes(
                  normalizeUrl(targetDAppIdentifier),
                )
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
      if (!web3wallet) return;
      const { topic: pairingTopic } = parseUri(uri);
      setCurrentPairingTopic(pairingTopic);
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
        await web3wallet.pair({ uri });
      } catch (error) {
        console.error('Failed to connect to WalletConnect: ', error);
        throw error;
      } finally {
        setIsLoadingPairing(false);
      }
    },
    [wallet?.getAddress, onApprove],
  );

  useEffect(() => {
    if (!web3wallet) return;

    // Pairing expired listener
    const pairingExpiredListener = ({ topic }: { topic: string }) => {
      if (topic === currentPairingTopic) {
        console.log('Pairing expired for topic:', topic);
        web3wallet.core.pairing.events.removeListener(
          'pairing_expire',
          pairingExpiredListener,
        );
      }
    };

    // Session proposal listener
    const sessionProposalListener = ({
      id,
      params,
      verifyContext,
    }: Web3WalletTypes.SessionProposal) => {
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
        wallet?.getAddress() || '',
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
    };

    // Session delete listener
    const sessionDeleteListener = async ({
      topic,
    }: Web3WalletTypes.SessionDelete) => {
      console.log('Session delete:', { topic });
      await web3wallet.disconnectSession({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
      setIsConnectedToDapp(false);
    };

    // Session request listener
    const sessionRequestListener = async ({
      topic,
      params,
      id,
    }: Web3WalletTypes.SessionRequest) => {
      console.log('Session request:', { topic, params, id });
      if (!wallet) {
        console.error('No signer found');
      } else {
        const { request } = params;
        const requestParamsMessage = request.params[0];

        // convert `requestParamsMessage` by using a method like hexToUtf8
        const message = convertHexToUtf8(requestParamsMessage);

        // sign the message
        const signedMessage = await wallet.signMessage(message);

        const response = { id, result: signedMessage, jsonrpc: '2.0' };
        console.log('response:', response);

        await web3wallet.respondSessionRequest({ topic, response });
      }
    };

    // Session request expire listener
    const sessionRequestExpireListener = ({
      id,
    }: Web3WalletTypes.SessionRequestExpire) => {
      console.log('Session request expired:', { id });
      // Handle expired session request
    };

    // Register listeners
    web3wallet.on('session_proposal', sessionProposalListener);
    web3wallet.on('session_delete', sessionDeleteListener);
    web3wallet.on('session_request', sessionRequestListener);
    web3wallet.on('session_request_expire', sessionRequestExpireListener);
    web3wallet.core.pairing.events.on('pairing_expire', pairingExpiredListener);

    // Cleanup function to remove listeners
    return () => {
      web3wallet.off('session_proposal', sessionProposalListener);
      web3wallet.off('session_delete', sessionDeleteListener);
      web3wallet.off('session_request', sessionRequestListener);
      web3wallet.off('session_request_expire', sessionRequestExpireListener);
      web3wallet.core.pairing.events.off(
        'pairing_expire',
        pairingExpiredListener,
      );
    };
  }, [currentPairingTopic, wallet]);

  return {
    isConnectedToDapp,
    isReady,
    onApprove,
    web3wallet,
    initializeWalletConnect,
    connectToDapp,
    disconnectWalletConnect,
    isLoadingPairing,
    isLoadingApprove,
  };
};
