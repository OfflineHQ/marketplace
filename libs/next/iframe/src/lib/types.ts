export enum ReceiveMessageType {
  CONNECT_STATUS = 'CONNECT_STATUS',
  UPDATE_CSS_VARIABLES_AND_CLASSES = 'UPDATE_CSS_VARIABLES_AND_CLASSES',
  OFF_KEY_STATE = 'OFF_KEY_STATE',
  // Additional message types can be added here as needed
}

export enum ConnectStatus {
  CONNECTED = 'connected', // Wallet is connected and verified with the dApp through SIWE
  DISCONNECTED = 'disconnected', // Wallet is disconnected from dApp
  CONNECTING = 'connecting', // Wallet is in the process of connecting to the dApp through SIWE
  ERROR = 'error', // An error occurred during the connection process
}

export enum OffKeyState {
  Unlocked = 'Unlocked',
  Locked = 'Locked',
  Unlocking = 'Unlocking',
  Used = 'Used',
}

export enum FontFamily {
  ROBOTO = 'roboto',
  OPEN_SANS = 'openSans',
  INTER = 'inter',
  NEUE_HAAS_GROTESK = 'neueHaasGrotesk',
  HELVETICA_NEUE = 'helveticaNeue',
}
export interface ReceiveMessageValues {
  [ReceiveMessageType.OFF_KEY_STATE]: {
    address: string;
    status: OffKeyState;
  };
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
  OFF_KEY_MINT = 'OFF_KEY_MINT',
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
  [SendMessageType.OFF_KEY_MINT]: {
    mintPassword: string;
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
