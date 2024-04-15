/* ../../node_modules/.pnpm/@cometh+connect-sdk@1.2.16_encoding@0.1.13/node_modules/@cometh/connect-sdk/dist/wallet/connectors/ConnectOnboardConnector.js:35:48
    Module not found: ESM packages (@web3-onboard/common) need to be imported */

// import { SupportedNetworks } from '@cometh/connect-sdk';

export enum SupportedNetworks {
  POLYGON = '0x89',
  MUMBAI = '0x13881',
  AMOY = '0x13882',
  AVALANCHE = '0xa86a',
  FUJI = '0xa869',
  XL_NETWORK = '0xc0c',
  GNOSIS = '0x64',
  CHIADO = '0x27d8',
  MUSTER = '0xfee',
  MUSTER_TESTNET = '0x205e79',
  REDSTONE_HOLESKY = '0x4269',
  OPTIMISM = '0xa',
  OPTIMISM_SEPOLIA = '0xaa37dc',
  ARBITRUM_ONE = '0xa4b1',
  ARBITRUM_SEPOLIA = '0x66eee',
  BASE = '0x2105',
  BASE_SEPOLIA = '0x14a34',
}
export interface AddEthereumChainParameter {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
  chainIdHex: SupportedNetworks;
  chainId: number;
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
  `https://${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY}`;

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
    chainId: 137,
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
    chainId: 80001,
  },
  80002: {
    urls: [
      getAlchemyUrlFor('polygon-amoy'),
      'https://rpc-amoy.polygon.technology/',
    ],
    name: 'Polygon Amoy',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://www.oklink.com/amoy'],
    safeTxServiceUrl: '', // not available (need to deploy our own ?): https://docs.safe.global/api-supported-networks
    chainIdHex: SupportedNetworks.MUMBAI,
    chainId: 80002,
  },
  84532: {
    urls: [getAlchemyUrlFor('base-sepolia'), 'https://sepolia.base.org'],
    name: 'Base Sepolia',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    safeTxServiceUrl: 'https://safe-transaction-base.safe.global',
    chainIdHex: SupportedNetworks.BASE_SEPOLIA,
    chainId: 84532,
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
