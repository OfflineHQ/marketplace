import { StateCreator } from 'zustand';
import { EventPassCart } from '../types';

export interface EventPassesSlice {
  passes: Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes
  updatePass: (
    organizerSlug: string,
    eventSlug: string,
    pass: EventPassCart
  ) => void;
  setPasses: (
    organizerSlug: string,
    eventSlug: string,
    passes: EventPassCart[]
  ) => void;
  getPasses: (
    organizerSlug: string,
    eventSlug: string
  ) => EventPassCart[] | undefined;
}

export const createEventPassesSlice: StateCreator<EventPassesSlice> = (
  set,
  get
) => ({
  passes: {},
  updatePass: (
    organizerSlug: string,
    eventSlug: string,
    pass: EventPassCart
  ) => {
    const passes = get().passes;

    if (!passes[organizerSlug]) {
      // This organizer does not exist yet, create it and add the event
      passes[organizerSlug] = { [eventSlug]: [pass] };
    } else if (!passes[organizerSlug][eventSlug]) {
      // The event does not exist yet, create it and add the pass
      passes[organizerSlug][eventSlug] = [pass];
    } else {
      // The event exists, find the pass
      const index = passes[organizerSlug][eventSlug].findIndex(
        (p) => p.id === pass.id
      );
      if (index !== -1) {
        // The pass exists, update it
        passes[organizerSlug][eventSlug][index] = pass;
      } else {
        // The pass does not exist, add it
        passes[organizerSlug][eventSlug].push(pass);
      }
    }

    set({ passes });
  },
  setPasses: (
    organizerSlug: string,
    eventSlug: string,
    newPasses: EventPassCart[]
  ) => {
    const passes = get().passes;

    if (!passes[organizerSlug]) {
      passes[organizerSlug] = {};
    }

    passes[organizerSlug][eventSlug] = newPasses;

    set({ passes });
  },
  getPasses: (organizerSlug: string, eventSlug: string) => {
    const passes = get().passes;

    if (passes[organizerSlug]) {
      return passes[organizerSlug][eventSlug];
    }
  },
});
