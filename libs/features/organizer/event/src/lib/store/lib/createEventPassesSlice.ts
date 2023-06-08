'use client';

import { StateCreator } from 'zustand';
import { EventPassCart, AllPassesCart } from '../../types';
import type { EventSlugs } from '@features/organizer/event/types';

interface UpdatePassProps extends EventSlugs {
  pass: EventPassCart;
}

interface SetPassesProps extends EventSlugs {
  newPasses: EventPassCart[];
}

export interface EventPassesSliceProps {
  passes: AllPassesCart;
  updatePass: (props: UpdatePassProps) => void;
  setPasses: (props: SetPassesProps) => void;
  deletePasses: (props: EventSlugs) => void;
  getPasses: (props: EventSlugs) => EventPassCart[] | undefined;
}

export const createEventPassesSlice: StateCreator<EventPassesSliceProps> = (
  set,
  get
) => ({
  passes: {},
  updatePass: ({ organizerSlug, eventSlug, pass }) => {
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
  setPasses: ({ organizerSlug, eventSlug, newPasses }) => {
    const passes = get().passes;

    if (!passes[organizerSlug]) {
      passes[organizerSlug] = {};
    }

    passes[organizerSlug][eventSlug] = newPasses;

    set({ passes });
  },
  deletePasses: ({ organizerSlug, eventSlug }) => {
    const passes = get().passes;
    if (passes[organizerSlug]?.[eventSlug]) {
      delete passes[organizerSlug][eventSlug];
    } else
      throw new Error(
        `Event passes for ${organizerSlug}/${eventSlug} do not exist`
      );
    set({ passes });
  },
  getPasses: ({ organizerSlug, eventSlug }) => {
    const passes = get().passes;

    if (passes[organizerSlug]) {
      return passes[organizerSlug][eventSlug];
    }
  },
});
