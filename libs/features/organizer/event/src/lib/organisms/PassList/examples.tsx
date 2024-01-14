// examples.tsx
import { passTotalProps } from '../../molecules/PassTotal/examples';
import { PassListProps } from './PassList';
import { SaleStatus } from '@features/organizer/event-types';

export const passListProps = {
  passes: passTotalProps['passesData'],
  eventSlug: 'event-slug',
  organizerSlug: 'organizer-slug',
  saleStatus: SaleStatus.Ongoing,
} satisfies PassListProps;
