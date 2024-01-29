import { EventPass } from '@features/back-office/content-spaces-types';

export const eventPassWorldCupFinale2023VIP: EventPass = {
  id: '1',
  name: 'VIP Pass',
  event: {
    slug: 'world-cup-finale-2023',
    title: 'World Cup Finale 2023',
  },
};

export const eventPassWorldCupFinale2023Premium: EventPass = {
  id: '2',
  name: 'Premium Pass',
  event: {
    slug: 'world-cup-finale-2023',
    title: 'World Cup Finale 2023',
  },
};

export const eventPassWorldCupFinale2023MeetAndGreet: EventPass = {
  id: '3',
  name: 'Meet and Greet',
  event: {
    slug: 'world-cup-finale-2023',
    title: 'World Cup Finale 2023',
  },
};

export const eventPassesWorldCupFinale: EventPass[] = [
  eventPassWorldCupFinale2023VIP,
  eventPassWorldCupFinale2023Premium,
  eventPassWorldCupFinale2023MeetAndGreet,
];
