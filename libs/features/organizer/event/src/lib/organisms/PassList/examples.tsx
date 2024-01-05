// examples.tsx
import { passTotalProps } from '../../molecules/PassTotal/examples';
import { PassListProps } from './PassList';

export const passListProps = {
  passes: passTotalProps['passesData'],
  eventSlug: 'event-slug',
  organizerSlug: 'organizer-slug',
} satisfies PassListProps;
