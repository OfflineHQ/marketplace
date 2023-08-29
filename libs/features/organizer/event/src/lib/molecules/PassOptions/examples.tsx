import type { PassOption } from '@features/organizer/event-types';

// Festival
export const passOptionsFestival: PassOption[] = [
  {
    name: 'VIP Access',
    description: 'Access to the VIP area with free drinks and snacks.',
    eventDateLocation: {
      dateStart: '2023-07-01T14:00:00+00:00',
      dateEnd: '2023-07-01T23:00:00+00:00',
      locationAddress: {
        city: 'Glastonbury',
        country: 'United Kingdom',
        postalCode: 'BA6 8JX',
        coordinates: {
          latitude: 51.1474,
          longitude: -2.7174,
        },
      },
    },
  },
  {
    name: 'Backstage Access',
    description:
      'Access to the backstage area with a chance to meet the artists.',
    eventDateLocation: {
      dateStart: '2023-07-01T14:00:00+00:00',
      dateEnd: '2023-07-01T23:00:00+00:00',
      locationAddress: {
        city: 'Glastonbury',
        country: 'United Kingdom',
        postalCode: 'BA6 8JX',
        coordinates: {
          latitude: 51.1474,
          longitude: -2.7174,
        },
      },
    },
  },
];

// All inclusive holidays
export const passOptionsHolidays: PassOption[] = [
  {
    name: 'All Inclusive Package',
    description: 'Access to all hotel facilities and free meals and drinks.',
    eventDateLocation: {
      dateStart: '2023-08-01T00:00:00+00:00',
      dateEnd: '2023-08-14T23:59:59+00:00',
      locationAddress: {
        city: 'Cancun',
        country: 'Mexico',
        postalCode: '77500',
        coordinates: {
          latitude: 21.1619,
          longitude: -86.8515,
        },
      },
    },
  },
  {
    name: 'Spa Package',
    description: 'Access to the hotel spa with free treatments.',
    eventDateLocation: {
      dateStart: '2023-08-02T10:00:00+00:00',
      dateEnd: '2023-08-02T20:00:00+00:00',
      locationAddress: {
        city: 'Cancun',
        country: 'Mexico',
        postalCode: '77500',
        coordinates: {
          latitude: 21.1619,
          longitude: -86.8515,
        },
      },
    },
  },
  {
    name: 'Adventure Package',
    description: 'Access to adventure activities like snorkeling and hiking.',
    eventDateLocation: {
      dateStart: '2023-08-03T09:00:00+00:00',
      dateEnd: '2023-08-03T18:00:00+00:00',
      locationAddress: {
        city: 'Cancun',
        country: 'Mexico',
        postalCode: '77500',
        coordinates: {
          latitude: 21.1619,
          longitude: -86.8515,
        },
      },
    },
  },
  {
    name: 'Cultural Package',
    description: 'Access to cultural tours to local historical sites.',
    eventDateLocation: {
      dateStart: '2023-08-04T09:00:00+00:00',
      dateEnd: '2023-08-04T18:00:00+00:00',
      locationAddress: {
        city: 'Cancun',
        country: 'Mexico',
        postalCode: '77500',
        coordinates: {
          latitude: 21.1619,
          longitude: -86.8515,
        },
      },
    },
  },
];

// Formula 1 tournament
export const passOptionsFormula1: PassOption[] = [
  {
    name: 'Paddock Club Access',
    description: 'Access to the Paddock Club with premium views of the race.',
    eventDateLocation: {
      dateStart: '2023-09-10T12:00:00+00:00',
      dateEnd: '2023-09-10T18:00:00+00:00',
      locationAddress: {
        city: 'Monza',
        country: 'Italy',
        postalCode: '20900',
        coordinates: {
          latitude: 45.6156,
          longitude: 9.2815,
        },
      },
    },
  },
  {
    name: 'Pit Lane Walk',
    description: 'Access to the pit lane before the race.',
    eventDateLocation: {
      dateStart: '2023-09-10T10:00:00+00:00',
      dateEnd: '2023-09-10T11:00:00+00:00',
      locationAddress: {
        city: 'Monza',
        country: 'Italy',
        postalCode: '20900',
        coordinates: {
          latitude: 45.6156,
          longitude: 9.2815,
        },
      },
    },
  },
  // ... add more options as needed
];

// Football championship
export const passOptionsFootball: PassOption[] = [
  {
    name: 'VIP Box Access',
    description: 'Access to a VIP box with premium views of the match.',
    eventDateLocation: {
      dateStart: '2023-06-12T20:00:00+00:00',
      dateEnd: '2023-06-12T22:00:00+00:00',
      locationAddress: {
        city: 'Munich',
        country: 'Germany',
        postalCode: '80939',
        coordinates: {
          latitude: 48.2188,
          longitude: 11.6247,
        },
      },
    },
  },
  {
    name: 'Meet and Greet',
    description: 'Meet and greet with the players after the match.',
    eventDateLocation: {
      dateStart: '2023-06-12T22:30:00+00:00',
      dateEnd: '2023-06-12T23:30:00+00:00',
      locationAddress: {
        city: 'Munich',
        country: 'Germany',
        postalCode: '80939',
        coordinates: {
          latitude: 48.2188,
          longitude: 11.6247,
        },
      },
    },
  },
];
