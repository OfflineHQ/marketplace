// EventLocations/examples.tsx
import {
  EventDateLocation,
  LocationAddress,
} from '@features/organizer/event-types';
import { type EventLocationsProps } from './EventLocations';

// Define some sample locations
export const location1: LocationAddress = {
  coordinates: {
    latitude: 40.7484405,
    longitude: -73.9878531,
  },
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postalCode: '10001',
  placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
};

export const location2: LocationAddress = {
  coordinates: {
    latitude: 40.7484405,
    longitude: -73.9878531,
  },
  street: '456 Broadway',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postalCode: '10004',
  placeId: 'ChIJhRwB-yFawokRv_x-4eLe3WI',
};

export const location3: LocationAddress = {
  coordinates: {
    latitude: 40.7484405,
    longitude: -73.9878531,
  },
  venue: 'Stade de France',
  city: 'Saint-Denis',
  state: 'Île-de-France',
  country: 'France',
  postalCode: '93216',
  placeId: 'ChIJyWrRcN1x5kcRMiszHJQu4Qg', // Google Place ID for Stade de France
};

// Define some sample event date locations
export const eventDateLocation1: EventDateLocation = {
  dateStart: '2023-06-01T00:00:00Z',
  dateEnd: '2023-06-01T08:00:00Z',
  locationAddress: location1,
};

export const eventDateLocation2: EventDateLocation = {
  dateStart: '2023-06-02T12:00:00Z',
  dateEnd: '2023-06-02T23:00:00Z',
  locationAddress: location2,
};

export const eventDateLocation3: EventDateLocation = {
  dateStart: '2023-09-12T18:00:00Z',
  dateEnd: '2023-09-14T22:00:00Z',
  locationAddress: location3,
};

export const eventLocationsProps: EventLocationsProps = {
  eventDateLocations: [eventDateLocation1, eventDateLocation2],
  detailed: false,
};

export const event2LocationsProps: EventLocationsProps = {
  eventDateLocations: [eventDateLocation3],
  detailed: false,
};
