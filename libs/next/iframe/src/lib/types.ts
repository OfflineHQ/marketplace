export enum ReceiveMessageType {
  CONNECT_STATUS = 'CONNECT_STATUS',
  // Additional message types can be added here as needed
}

export enum ConnectStatus {
  CONNECTED = 'CONNECTED', // Wallet is connected and verified with the dApp through SIWE
  DISCONNECTED = 'DISCONNECTED', // Wallet is disconnected from dApp
  CONNECTING = 'CONNECTING', // Wallet is in the process of connecting to the dApp through SIWE
  ERROR = 'ERROR', // An error occurred during the connection process
}

export interface ReceiveMessageValues {
  [ReceiveMessageType.CONNECT_STATUS]: {
    address: string;
    status: ConnectStatus;
  };
  // Additional value shapes can be defined here corresponding to the ReceiveMessageType
}

export enum SendMessageType {
  DISCONNECT = 'DISCONNECT',
  SIGNATURE = 'SIGNATURE',
  OFFKEY_MINTED = 'OFFKEY_MINTED',
}

export interface SendMessageValues {
  [SendMessageType.DISCONNECT]: {
    address: string;
  };
  [SendMessageType.SIGNATURE]: {
    address: string;
    message: string;
    signature: string;
  };
  [SendMessageType.OFFKEY_MINTED]: {
    contractAddress: string;
    tokenId: string;
  };
  // Additional value shapes can be defined here corresponding to the SendMessageType
}
