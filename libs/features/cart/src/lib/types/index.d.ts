import type { Event } from '@features/organizer/event/types';

export enum OwnedEventPassStatus {
  Reserved = 'reserved',
  Purchased = 'purchased',
  Revealed = 'revealed',
}

export type EventCart = Pick<Event, 'id' | 'title' | 'heroImage' | 'slug'>;

export interface LocalCartItem {
  eventPassId: string; // The original pass type id
  quantity: number; // Number of this item in the cart
}

export interface LocalCart {
  items: LocalCartItem[]; // Array of local cart items
}

// Define the data structure for an owned/reserved event pass
export interface OwnedEventPass {
  id?: string; // Assuming UUIDs
  eventPassId: string; // The original pass type id
  ownerId: string; // User id
  eventPass: EventPass; // The original pass type
  transactionId?: string; // Transaction ID from the blockchain
  nftMetadataUri?: string; // The URI to the NFT metadata stored on the blockchain
  status: OwnedEventPassStatus; // Status of the owned pass
  revealTimestamp?: string; // ISO 8601 datetime string when the ticket was revealed
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

// Define the data structure for a cart item
export interface CartItem {
  id?: string; // Assuming UUIDs
  cartId: string; // The cart ID this item belongs to
  ownerId: string; // User id
  ownedEventPassId: string; // Owned event pass id
  ownedEventPass: OwnedEventPass; // Owned event pass data
  quantity: number; // Number of this item in the cart
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

// Define the data structure for a cart
export interface Cart {
  id?: string; // Assuming UUIDs
  ownerId: string; // User id
  cartItems: CartItem[]; // Array of cart items
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

export enum BlockchainTransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
  AwaitingConfirmation = 'awaiting_confirmation',
  Rejected = 'rejected',
}

// Define the data structure for a transaction on the blockchain
export interface BlockchainTransaction {
  id: string; // Transaction ID from the blockchain
  ownerId: string; // User id
  status: BlockchainTransactionStatus; // Transaction status
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}
