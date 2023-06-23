import type { BoundedNumericStepperProps } from '@ui/components';
import type {
  GetEventQuery,
  Coordinates as TCoordinates,
  EventDateLocation as TEventDateLocation,
  LocationAddress as TLocationAddress,
  Organizer as TOrganizer,
  GetEventPassesQuery,
} from '@gql/admin/types';

export interface EventSlugs {
  eventSlug: string;
  organizerSlug: string;
}

// Define the data structure for a pass option
export interface PassOption {
  id?: string; // Assuming UUIDs
  name: string; // Name of the option, like "Day 1 Access" or "VIP Room Access"
  description: string; // Description of the option, like "Access to the event on Day 1"
  eventDateLocationId?: string; // Foreign key reference
  eventDateLocation: EventDateLocation; // A single date and location object
  // specialAccess?: string[]; // Array of special access options like "VIP room"
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

// Define the data structure for a pass
export interface EventPass {
  id: string; // Assuming UUIDs
  name: string; // User-friendly name of the pass, like "VIP 3-Day Pass"
  type?: string; // Type of the pass, like "Standard", "VIP", "Backstage", etc.
  price: number;
  description: string; // Description of the pass, like "Access to the event for 3 days. Day 1 access to the VIP room. etc."
  ownersId?: string[]; // Many to One Foreign key reference to Users owning this pass
  passOptions?: PassOption[]; // Array of pass option objects
  passOptionIds?: string[]; // Array of foreign key references
  eventId?: string; // Foreign key reference
  maxAmountPerUser?: number; // Max amount of this type of pass per user
  maxAmount: number; // Max amount of this type of pass
  currentAmount: number; // Computed field for current amount of this type of pass
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

// Define the data structure for an event
export type Event = NonNullable<GetEventQuery['event']>;

export type EventDateLocation = Event['eventDateLocations'][0];

export type LocationAddress = EventDateLocation['locationAddress'];

export type EventOrganizer = NonNullable<Event['organizer']>;

export type EventPasses = NonNullable<GetEventPassesQuery['eventPasses']>;

export interface EventPassCart
  extends Omit<BoundedNumericStepperProps, 'initialValue' | 'maxVal'>,
    EventPass {
  numTickets: number;
  soldOutText?: string;
}

export type AllPassesCart = Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes
