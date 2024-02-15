import { SupportedNetworks } from '@cometh/connect-sdk';
import type { AddEthereumChainParameter } from '@web3-react/types';

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
  chainIdHex: SupportedNetworks;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
  safeTxServiceUrl: string;
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(
  chainId: number,
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

// const getInfuraUrlFor = (network: string) =>
//   process.env.infuraKey
//     ? `https://${network}.infura.io/v3/${process.env.infuraKey}`
//     : undefined;
const getAlchemyUrlFor = (network: string) =>
  `https://${network}.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY}`;

type ChainConfig = {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
};

export const MAINNET_CHAINS: ChainConfig = {
  137: {
    urls: [getAlchemyUrlFor('polygon-mainnet'), 'https://polygon-rpc.com'],
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
    safeTxServiceUrl: 'https://safe-transaction-polygon.safe.global',
    chainIdHex: SupportedNetworks.POLYGON,
  },
};

export const TESTNET_CHAINS: ChainConfig = {
  80001: {
    urls: [
      getAlchemyUrlFor('polygon-mumbai'),
      'https://polygon-mumbai-pokt.nodies.app',
      'https://polygon-testnet.public.blastapi.io',
    ],
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    safeTxServiceUrl: '', // not available (need to deploy our own ?): https://docs.safe.global/api-supported-networks
    chainIdHex: SupportedNetworks.MUMBAI,
  },
};

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS,
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});

export const getCurrentChain = () => {
  return CHAINS[
    Number(
      (process.env.NEXT_PUBLIC_CHAIN as string) ||
        (process.env.CHAIN as string),
    )
  ];
};
