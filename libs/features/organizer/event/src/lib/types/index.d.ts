import type { BoundedNumericStepperProps } from '@ui/components';

export interface EventSlugs {
  eventSlug: string;
  organizerSlug: string;
}

export interface EventOrganizer {
  id: string; // Assuming UUIDs
  slug: string; // URL slug used in the URL
  name: string;
  description: string;
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

export interface User {
  id: string; // Assuming UUIDs
  name: string;
  email: string;
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

export interface Location {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  placeId: string; // Google Maps' unique identifier for a place
}

// Define the data structure for a date and location
export interface EventDateLocation {
  id?: string; // Assuming UUIDs
  dateStart: string; // ISO 8601 datetime string in the event's local timezone
  dateEnd: string; // ISO 8601 datetime string in the event's local timezone
  location: Location;
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

// Define the data structure for a pass option
export interface PassOption {
  id?: string; // Assuming UUIDs
  name: string; // Name of the option, like "Day 1 Access" or "VIP Room Access"
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
  description: string;
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
export interface Event {
  id: string; // Assuming UUIDs
  slug: string; // URL slug used in the URL
  heroImage: string; // URL to the hero image
  title: string;
  description: string;
  organizer: EventOrganizer; // Single organizer object
  organizerId?: string; // Foreign key reference to Organizer
  eventDateLocationIds?: string[]; // Array of foreign key references
  passIds?: string[]; // Array of foreign key references
  eventDateLocations: EventDateLocation[]; // Array of date and location objects
  // followers: string[]; // Array of User ids who follow this event
  isOngoing: boolean; // Computed field to check if the event is ongoing
  createdAt?: string; // Timestamps
  updatedAt?: string; // Timestamps
}

// Define the props that the EventTemplate component will take
export interface EventTemplateProps {
  event: Event;
}

export interface EventPassCart
  extends Omit<BoundedNumericStepperProps, 'initialValue' | 'maxVal'>,
    EventPass {
  numTickets: number;
  soldOutText?: string;
}

export type AllPassesCart = Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes
