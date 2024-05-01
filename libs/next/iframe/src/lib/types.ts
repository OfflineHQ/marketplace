export enum ReceiveMessageType {
  CONNECT_STATUS = 'CONNECT_STATUS',
  UPDATE_CSS_VARIABLES_AND_CLASSES = 'UPDATE_CSS_VARIABLES_AND_CLASSES',
  OFF_KEY_STATE = 'OFF_KEY_STATE',
  CUSTOMER = 'CUSTOMER',
  LINKED_CUSTOMER = 'LINKED_CUSTOMER',
  PRODUCT = 'PRODUCT',
  // Additional message types can be added here as needed
}

export enum ConnectStatus {
  CONNECTED = 'connected', // Wallet is connected and verified with the dApp through SIWE
  DISCONNECTED = 'disconnected', // Wallet is disconnected from dApp
  CONNECTING = 'connecting', // Wallet is in the process of connecting to the dApp through SIWE
  ERROR = 'error', // An error occurred during the connection process
}

export enum OffKeyState {
  Unlocked = 'Unlocked', // The off-key is unlocked and can be used
  Locked = 'Locked', // The off-key is locked and cannot be used
  Unlocking = 'Unlocking', // The off-key is unlocking (being created)
  Used = 'Used', // The off-key has been used and cannot be used again in this context
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
  [ReceiveMessageType.CUSTOMER]: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  [ReceiveMessageType.LINKED_CUSTOMER]: {
    address: string | null; // null means data loaded but no linked customer
  };
  [ReceiveMessageType.PRODUCT]: {
    id: string;
    title: string;
    available: boolean;
  };
  // Additional value shapes can be defined here corresponding to the ReceiveMessageType
}

export enum SendMessageType {
  DISCONNECT = 'DISCONNECT',
  SIGNATURE = 'SIGNATURE',
  OFF_KEY_MINT = 'OFF_KEY_MINT',
  CONNECT_STATUS = 'CONNECT_STATUS',
  CONNECT_TO_SHOPIFY = 'CONNECT_TO_SHOPIFY',
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
  [SendMessageType.CONNECT_TO_SHOPIFY]: null;
  // Additional value shapes can be defined here corresponding to the SendMessageType
}

export interface IFrameParentMessage<T extends ReceiveMessageType> {
  type: T;
  value: ReceiveMessageValues[T];
}
