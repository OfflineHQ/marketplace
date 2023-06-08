// EventLocations/examples.tsx
import { EventDateLocation, Location } from '../../types';
import { type EventLocationsProps } from './EventLocations';

// Define some sample locations
export const location1: Location = {
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postalCode: '10001',
  placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
};

export const location2: Location = {
  street: '456 Broadway',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postalCode: '10004',
  placeId: 'ChIJhRwB-yFawokRv_x-4eLe3WI',
};

export const location3: Location = {
  venue: 'Stade de France',
  city: 'Saint-Denis',
  state: 'Île-de-France',
  country: 'France',
  postalCode: '93216',
  placeId: 'ChIJyWrRcN1x5kcRMiszHJQu4Qg', // Google Place ID for Stade de France
};

// Define some sample event date locations
export const eventDateLocation1: EventDateLocation = {
  id: '1',
  dateStart: '2023-06-01T00:00:00Z',
  dateEnd: '2023-06-01T08:00:00Z',
  location: location1,
};

export const eventDateLocation2: EventDateLocation = {
  id: '2',
  dateStart: '2023-06-02T12:00:00Z',
  dateEnd: '2023-06-02T23:00:00Z',
  location: location2,
};

export const eventDateLocation3: EventDateLocation = {
  id: '3',
  dateStart: '2023-09-12T18:00:00Z',
  dateEnd: '2023-09-14T22:00:00Z',
  location: location3,
};

export const eventLocationsProps: EventLocationsProps = {
  eventDateLocations: [eventDateLocation1, eventDateLocation2],
  detailed: false,
};

export const event2LocationsProps: EventLocationsProps = {
  eventDateLocations: [eventDateLocation3],
  detailed: false,
};
