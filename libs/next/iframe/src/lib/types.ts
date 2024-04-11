export enum ReceiveMessageType {
  CONNECT_STATUS = 'CONNECT_STATUS',
  UPDATE_CSS_VARIABLES_AND_CLASSES = 'UPDATE_CSS_VARIABLES_AND_CLASSES',
  // Additional message types can be added here as needed
}

export enum ConnectStatus {
  CONNECTED = 'connected', // Wallet is connected and verified with the dApp through SIWE
  DISCONNECTED = 'disconnected', // Wallet is disconnected from dApp
  CONNECTING = 'connecting', // Wallet is in the process of connecting to the dApp through SIWE
  ERROR = 'error', // An error occurred during the connection process
}

export enum FontFamily {
  OPEN_SANS = 'openSans',
  ROBOTO = 'roboto',
  INTER = 'inter',
  HELVETICA_NEUE = 'helveticaNeue',
}
export interface ReceiveMessageValues {
  [ReceiveMessageType.CONNECT_STATUS]: {
    address: string;
    status: ConnectStatus;
  };
  [ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES]: {
    cssVariables: Record<string, string>;
    classes: string;
    fontFamily: FontFamily;
  };
  // Additional value shapes can be defined here corresponding to the ReceiveMessageType
}

export enum SendMessageType {
  DISCONNECT = 'DISCONNECT',
  SIGNATURE = 'SIGNATURE',
  OFFKEY_MINTED = 'OFFKEY_MINTED',
  CONNECT_STATUS = 'CONNECT_STATUS',
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
  [SendMessageType.CONNECT_STATUS]: {
    address: string;
  };
  // Additional value shapes can be defined here corresponding to the SendMessageType
}

export interface IFrameParentMessage<T extends ReceiveMessageType> {
  type: T;
  value: ReceiveMessageValues[T];
}
