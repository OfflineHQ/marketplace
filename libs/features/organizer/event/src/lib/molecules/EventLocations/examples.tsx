// EventLocations/examples.tsx
import { EventDateLocation, Location } from '../../types';
import { EventLocations } from './EventLocations';

// Define some sample locations
const location1: Location = {
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postalCode: '10001',
  placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
};

const location2: Location = {
  street: '456 Broadway',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  postalCode: '10004',
  placeId: 'ChIJhRwB-yFawokRv_x-4eLe3WI',
};

// Define some sample event date locations
const eventDateLocation1: EventDateLocation = {
  id: '1',
  dateStart: '2023-06-01T00:00:00Z',
  dateEnd: '2023-06-01T23:59:59Z',
  location: location1,
};

const eventDateLocation2: EventDateLocation = {
  id: '2',
  dateStart: '2023-06-02T00:00:00Z',
  dateEnd: '2023-06-02T23:59:59Z',
  location: location2,
};

export const eventLocationsProps = {
  locations: [eventDateLocation1, eventDateLocation2],
  detailed: false,
};

export const EventLocationsExample = () => (
  <EventLocations {...eventLocationsProps} />
);
